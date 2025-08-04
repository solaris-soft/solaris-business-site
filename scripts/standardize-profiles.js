#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputFormat: 'webp',
  dimensions: {
    width: 400,
    height: 400
  },
  quality: 80,
  fit: 'cover',
  position: 'center'
};

// Profile image patterns to process
const PROFILE_PATTERNS = [
  '*-profile.webp',
  '*-profile.png',
  '*-profile.jpg',
  '*-profile.jpeg'
];

// Backup patterns to clean up
const BACKUP_PATTERNS = [
  'backup-*.webp',
  'OLD-*.webp'
];

async function getAssetsPath() {
  return path.join(__dirname, '..', 'src', 'assets');
}

async function findProfileImages(assetsPath) {
  const files = await fs.readdir(assetsPath);
  const profileImages = [];
  
  for (const file of files) {
    const filePath = path.join(assetsPath, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isFile()) {
      // Check if it matches profile patterns
      const isProfile = PROFILE_PATTERNS.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
      });
      
      // Check if it's a backup file
      const isBackup = BACKUP_PATTERNS.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
      });
      
      if (isProfile && !isBackup) {
        profileImages.push({
          name: file,
          path: filePath,
          size: stat.size
        });
      }
    }
  }
  
  return profileImages;
}

async function standardizeImage(inputPath, outputPath, config) {
  try {
    console.log(`Processing: ${path.basename(inputPath)}`);
    
    // Create a temporary file path
    const tempPath = outputPath.replace('.webp', '.temp.webp');
    
    await sharp(inputPath)
      .resize(config.dimensions.width, config.dimensions.height, {
        fit: config.fit,
        position: config.position
      })
      .webp({ quality: config.quality })
      .toFile(tempPath);
    
    // Get original file size before replacing
    const inputStat = await fs.stat(inputPath);
    
    // Replace the original file with the processed one
    await fs.unlink(outputPath);
    await fs.rename(tempPath, outputPath);
    
    // Get final file size
    const outputStat = await fs.stat(outputPath);
    
    console.log(`  ✓ Standardized: ${path.basename(outputPath)}`);
    console.log(`  📏 Dimensions: ${config.dimensions.width}x${config.dimensions.height}`);
    console.log(`  📦 Size: ${(outputStat.size / 1024).toFixed(1)}KB (was ${(inputStat.size / 1024).toFixed(1)}KB)`);
    
    return {
      success: true,
      originalSize: inputStat.size,
      newSize: outputStat.size,
      compression: ((inputStat.size - outputStat.size) / inputStat.size * 100).toFixed(1)
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${path.basename(inputPath)}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function createBackup(originalPath) {
  const backupPath = originalPath.replace('.webp', '.backup.webp');
  await fs.copyFile(originalPath, backupPath);
  return backupPath;
}

async function main() {
  try {
    console.log('🖼️  Profile Image Standardization Script');
    console.log('==========================================\n');
    
    const assetsPath = await getAssetsPath();
    const profileImages = await findProfileImages(assetsPath);
    
    if (profileImages.length === 0) {
      console.log('No profile images found to process.');
      return;
    }
    
    console.log(`Found ${profileImages.length} profile image(s) to process:\n`);
    
    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let processedCount = 0;
    
    for (const image of profileImages) {
      console.log(`\n📸 Processing: ${image.name}`);
      
      // Create backup
      const backupPath = await createBackup(image.path);
      console.log(`  💾 Backup created: ${path.basename(backupPath)}`);
      
      // Standardize the image
      const result = await standardizeImage(image.path, image.path, CONFIG);
      
      if (result.success) {
        totalOriginalSize += result.originalSize;
        totalNewSize += result.newSize;
        processedCount++;
        
        console.log(`  📊 Compression: ${result.compression}%`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully processed: ${processedCount}/${profileImages.length} images`);
    console.log(`📦 Total size reduction: ${((totalOriginalSize - totalNewSize) / 1024).toFixed(1)}KB`);
    console.log(`💾 Overall compression: ${((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log(`🎯 Standard dimensions: ${CONFIG.dimensions.width}x${CONFIG.dimensions.height}px`);
    console.log(`📄 Format: ${CONFIG.outputFormat.toUpperCase()}`);
    console.log(`⚙️  Quality: ${CONFIG.quality}%`);
    
    console.log('\n💡 Tips:');
    console.log('  - Backup files have been created with .backup.webp extension');
    console.log('  - You can delete backup files once you\'re satisfied with the results');
    console.log('  - All images are now optimized for web use');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 