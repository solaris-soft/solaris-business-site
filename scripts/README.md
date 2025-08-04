# Profile Image Standardization Scripts

This directory contains scripts to standardize and manage profile images in the `src/assets/` directory.

## Scripts

### 1. Profile Standardization (`standardize-profiles.js`)

Standardizes all profile images to ensure consistent dimensions, format, and optimization.

**What it does:**
- **Resizes** all profile images to 400x400px
- **Converts** to WebP format for better compression
- **Optimizes** quality (80%) for web use
- **Creates backups** before processing
- **Provides detailed reporting** on file sizes and compression

**Usage:**
```bash
npm run standardize-profiles
```

### 2. Backup Cleanup (`cleanup-backups.js`)

Removes backup files created during the standardization process.

**What it does:**
- Finds and removes `.backup.webp` files
- Removes old backup files (`backup-*`, `OLD-*`)
- Reports space freed and files removed

**Usage:**
```bash
npm run cleanup-backups
```

## Configuration

The standardization script processes files matching these patterns:
- `*-profile.webp`
- `*-profile.png` 
- `*-profile.jpg`
- `*-profile.jpeg`

It automatically skips backup files:
- `backup-*.webp`
- `OLD-*.webp`

## Output

- All profile images are standardized to 400x400px WebP format
- Backup files are created with `.backup.webp` extension
- Detailed console output shows compression statistics

## Safety Features

- Creates automatic backups before processing
- Only processes files matching profile patterns
- Skips existing backup files
- Provides detailed error reporting

## Example Output

```
🖼️  Profile Image Standardization Script
==========================================

Found 3 profile image(s) to process:

📸 Processing: josh-profile.webp
  💾 Backup created: josh-profile.backup.webp
  ✓ Standardized: josh-profile.webp
  📏 Dimensions: 400x400
  📦 Size: 12.3KB (was 14.2KB)
  📊 Compression: 13.4%

📈 SUMMARY
==================================================
✅ Successfully processed: 3/3 images
📦 Total size reduction: 8.7KB
💾 Overall compression: 15.2%
🎯 Standard dimensions: 400x400px
📄 Format: WEBP
⚙️  Quality: 80%
```

## Workflow

1. **Run standardization:** `npm run standardize-profiles`
2. **Verify results** in your application
3. **Clean up backups:** `npm run cleanup-backups` (optional)

## Dependencies

- `sharp` - Image processing library (already included in devDependencies)
- Node.js ES modules support 