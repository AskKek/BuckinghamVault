#!/usr/bin/env node

/**
 * Image Optimization Script for Buckingham Vault
 * Converts PNG images to WebP and AVIF formats with responsive sizing
 * Maintains premium quality while reducing file sizes significantly
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Premium quality settings for luxury brand
const QUALITY_SETTINGS = {
  webp: { quality: 85, effort: 6 },
  avif: { quality: 82, effort: 9 },
  png: { quality: 90, compressionLevel: 9 }
};

// Responsive breakpoints for different viewports
const RESPONSIVE_SIZES = [
  { suffix: '-sm', width: 640, height: null },    // Mobile
  { suffix: '-md', width: 1024, height: null },   // Tablet
  { suffix: '-lg', width: 1920, height: null },   // Desktop
  { suffix: '-xl', width: 2560, height: null }    // Large displays
];

// Critical images that need preloading optimization
const CRITICAL_IMAGES = [
  'home-page-vault.png',
  'our-mission.png'
];

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function optimizeImage(inputPath, filename) {
  const name = path.parse(filename).name;
  const isCritical = CRITICAL_IMAGES.includes(filename);
  
  console.log(`\n🎯 Optimizing: ${filename} ${isCritical ? '(Critical)' : ''}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`   Original: ${Math.round(fs.statSync(inputPath).size / 1024)}KB (${metadata.width}x${metadata.height})`);
    
    // Generate responsive sizes
    for (const size of RESPONSIVE_SIZES) {
      const shouldResize = metadata.width > size.width;
      const baseImage = shouldResize ? 
        image.clone().resize(size.width, size.height, { 
          fit: 'inside', 
          withoutEnlargement: true 
        }) : image.clone();
      
      // WebP format (best compatibility)
      const webpPath = path.join(OUTPUT_DIR, `${name}${size.suffix}.webp`);
      await baseImage
        .webp(QUALITY_SETTINGS.webp)
        .toFile(webpPath);
      
      const webpSize = Math.round(fs.statSync(webpPath).size / 1024);
      console.log(`   WebP ${size.suffix}: ${webpSize}KB`);
      
      // AVIF format (best compression)
      const avifPath = path.join(OUTPUT_DIR, `${name}${size.suffix}.avif`);
      await baseImage
        .avif(QUALITY_SETTINGS.avif)
        .toFile(avifPath);
      
      const avifSize = Math.round(fs.statSync(avifPath).size / 1024);
      console.log(`   AVIF ${size.suffix}: ${avifSize}KB`);
      
      // Optimized PNG fallback
      const pngPath = path.join(OUTPUT_DIR, `${name}${size.suffix}.png`);
      await baseImage
        .png({ 
          quality: QUALITY_SETTINGS.png.quality,
          compressionLevel: QUALITY_SETTINGS.png.compressionLevel,
          progressive: true
        })
        .toFile(pngPath);
      
      const pngSize = Math.round(fs.statSync(pngPath).size / 1024);
      console.log(`   PNG ${size.suffix}: ${pngSize}KB`);
    }
    
    // Generate blur placeholder for premium loading experience
    const placeholderPath = path.join(OUTPUT_DIR, `${name}-placeholder.webp`);
    await image
      .resize(20, null, { fit: 'inside' })
      .blur(2)
      .webp({ quality: 20 })
      .toFile(placeholderPath);
    
    console.log(`   ✨ Blur placeholder generated`);
    
  } catch (error) {
    console.error(`   ❌ Failed to optimize ${filename}:`, error.message);
  }
}

async function generateImageManifest() {
  const manifestPath = path.join(OUTPUT_DIR, 'image-manifest.json');
  const manifest = {
    lastUpdated: new Date().toISOString(),
    optimizations: {},
    responsive: RESPONSIVE_SIZES.map(s => s.suffix),
    formats: ['avif', 'webp', 'png'],
    critical: CRITICAL_IMAGES
  };
  
  // Scan optimized directory for file sizes
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => 
    f.endsWith('.webp') || f.endsWith('.avif') || f.endsWith('.png')
  );
  
  files.forEach(file => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, file));
    const [name, suffix, format] = file.replace(/\.(webp|avif|png)$/, '').split(/(-sm|-md|-lg|-xl|$)/);
    
    if (!manifest.optimizations[name]) {
      manifest.optimizations[name] = {};
    }
    if (!manifest.optimizations[name][suffix || 'original']) {
      manifest.optimizations[name][suffix || 'original'] = {};
    }
    
    const ext = path.extname(file).slice(1);
    manifest.optimizations[name][suffix || 'original'][ext] = {
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024)
    };
  });
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Generated image manifest: ${manifestPath}`);
}

async function main() {
  console.log('🏰 Buckingham Vault Image Optimization');
  console.log('=====================================');
  
  await ensureOutputDir();
  
  const imageFiles = fs.readdirSync(INPUT_DIR).filter(file => 
    file.toLowerCase().endsWith('.png') && !file.startsWith('.')
  );
  
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  for (const filename of imageFiles) {
    const inputPath = path.join(INPUT_DIR, filename);
    await optimizeImage(inputPath, filename);
  }
  
  await generateImageManifest();
  
  console.log('\n✅ Image optimization complete!');
  console.log(`📁 Optimized images saved to: ${OUTPUT_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Update components to use optimized images');
  console.log('   2. Implement responsive picture elements');
  console.log('   3. Add preload hints for critical images');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, RESPONSIVE_SIZES, QUALITY_SETTINGS };