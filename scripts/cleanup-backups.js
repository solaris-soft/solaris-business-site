#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAssetsPath() {
  return path.join(__dirname, '..', 'src', 'assets');
}

async function findBackupFiles(assetsPath) {
  const files = await fs.readdir(assetsPath);
  const backupFiles = [];
  
  for (const file of files) {
    const filePath = path.join(assetsPath, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isFile()) {
      // Check for backup patterns
      if (file.includes('.backup.webp') || file.startsWith('backup-') || file.startsWith('OLD-')) {
        backupFiles.push({
          name: file,
          path: filePath,
          size: stat.size
        });
      }
    }
  }
  
  return backupFiles;
}

async function main() {
  try {
    console.log('🧹 Profile Image Backup Cleanup Script');
    console.log('======================================\n');
    
    const assetsPath = await getAssetsPath();
    const backupFiles = await findBackupFiles(assetsPath);
    
    if (backupFiles.length === 0) {
      console.log('No backup files found to clean up.');
      return;
    }
    
    console.log(`Found ${backupFiles.length} backup file(s) to remove:\n`);
    
    let totalSize = 0;
    let removedCount = 0;
    
    for (const file of backupFiles) {
      console.log(`🗑️  Removing: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      
      try {
        await fs.unlink(file.path);
        totalSize += file.size;
        removedCount++;
        console.log(`  ✅ Removed successfully`);
      } catch (error) {
        console.error(`  ❌ Error removing ${file.name}:`, error.message);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 CLEANUP SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully removed: ${removedCount}/${backupFiles.length} files`);
    console.log(`📦 Total space freed: ${(totalSize / 1024).toFixed(1)}KB`);
    
    if (removedCount > 0) {
      console.log('\n🎉 Cleanup completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 