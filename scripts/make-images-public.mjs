import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// Load environment variables from .env file
try {
  const envContent = await fs.readFile('.env', 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
} catch (error) {
  console.log('⚠️  No .env file found, using system environment variables');
}

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔍 Checking and making images public...\n');

async function makeImagesPublic() {
  try {
    const prefix = 'qblog/AIEngineerGuide/images/';
    
    console.log(`📂 Finding all images with prefix: ${prefix}`);
    
    // Get all resources with our prefix
    let allResources = [];
    let nextCursor = null;
    
    do {
      const listResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: prefix,
        max_results: 100,
        next_cursor: nextCursor
      });
      
      allResources = allResources.concat(listResult.resources);
      nextCursor = listResult.next_cursor;
      
      console.log(`📄 Found ${listResult.resources.length} more images (total so far: ${allResources.length})`);
    } while (nextCursor);
    
    console.log(`\n🎯 Total images found: ${allResources.length}`);
    
    if (allResources.length === 0) {
      console.log('❌ No images found with the specified prefix.');
      return;
    }
    
    let publicCount = 0;
    let madePublicCount = 0;
    let errorCount = 0;
    
    console.log('\n🔍 Checking access mode and making images public...\n');
    
    for (const resource of allResources) {
      try {
        const publicId = resource.public_id;
        const accessMode = resource.access_mode || 'public';
        
        if (accessMode === 'public') {
          console.log(`✅ Already public: ${publicId.split('/').pop()}`);
          publicCount++;
        } else {
          console.log(`🔐 Making public: ${publicId.split('/').pop()}`);
          
          // Update the resource to be public
          await cloudinary.api.update(publicId, {
            access_mode: 'public'
          });
          
          console.log(`   ✅ Now public: ${publicId.split('/').pop()}`);
          madePublicCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error with ${resource.public_id}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Process completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Already public: ${publicCount}`);
    console.log(`   - Made public: ${madePublicCount}`);
    console.log(`   - Errors: ${errorCount}`);
    console.log(`   - Total processed: ${allResources.length}`);
    
    if (errorCount === 0) {
      console.log('\n🌟 All images are now publicly accessible!');
      console.log('🔗 Your CDN URLs should work perfectly now.');
    } else {
      console.log(`\n⚠️  ${errorCount} images had issues. Please check them manually.`);
    }
    
    // Test a few URLs
    console.log('\n🧪 Testing some URLs:');
    const testSamples = allResources.slice(0, 3);
    for (const resource of testSamples) {
      const testUrl = `${CDN_BASE_URL}/${resource.public_id}.${resource.format}`;
      console.log(`   ${testUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Process failed:', error.message);
    if (error.http_code) {
      console.error(`HTTP ${error.http_code}: ${error.message}`);
    }
  }
}

const CDN_BASE_URL = 'https://images.nesin.io';

makeImagesPublic(); 
