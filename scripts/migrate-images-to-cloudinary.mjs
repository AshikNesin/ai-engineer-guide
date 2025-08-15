
import { v2 as cloudinary } from 'cloudinary';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

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

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_PATH = '../content/blog/**/*.md';
const STATIC_IMAGES_PATH = '../static/images';
const STATE_FILE = './migration-state.json';
const PROGRESS_FILE = './migration-progress.json';

// Updated regex to correctly match standard markdown images: ![alt](/images/filename.png)
const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

const CLOUDINARY_PREFIX = 'qblog/AIEngineerGuide/images';
const CDN_BASE_URL = 'https://images.nesin.io';

// --- Cloudinary Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Validation ---
function validateConfig() {
  const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please set these environment variables and try again.');
    process.exit(1);
  }
}

// --- State Management ---
async function loadState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}; // Return empty state if file doesn't exist
    }
    throw error;
  }
}

async function saveState(state) {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

async function loadProgress() {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { processedFiles: [] };
    }
    throw error;
  }
}

async function saveProgress(progress) {
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// --- Helper Functions ---
function extractDateFromPath(filePath) {
  // Extract date from path like: ../content/blog/2025-08/13-openai-models-free-github.md
  const match = filePath.match(/\/(\d{4})-(\d{2})\//);
  if (match) {
    return {
      year: match[1],
      month: match[2]
    };
  }
  return null;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// --- Main Logic ---
async function main() {
  console.log('🚀 Starting image migration to Cloudinary...');
  
  validateConfig();
  
  const state = await loadState();
  const progress = await loadProgress();
  
  const staticImagesPath = path.resolve(__dirname, STATIC_IMAGES_PATH);
  console.log(`📂 Static images directory: ${staticImagesPath}`);
  
  const markdownFiles = await glob(POSTS_PATH, { cwd: __dirname });
  console.log(`📄 Found ${markdownFiles.length} markdown files`);

  let totalProcessed = 0;
  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const file of markdownFiles) {
    const absoluteFilePath = path.resolve(__dirname, file);
    
    // Skip if already processed (for resumability)
    if (progress.processedFiles.includes(absoluteFilePath)) {
      console.log(`⏭️  Skipping already processed file: ${path.basename(file)}`);
      continue;
    }
    
    console.log(`\n📖 Processing file: ${file}`);
    
    try {
      let content = await fs.readFile(absoluteFilePath, 'utf-8');
      let modified = false;
      let fileHasImages = false;

      const { data: frontmatter } = matter(content);
      
      // Extract date from frontmatter or file path
      let year, month;
      
      if (frontmatter.date) {
        const date = new Date(frontmatter.date);
        year = date.getFullYear();
        month = String(date.getMonth() + 1).padStart(2, '0');
      } else {
        const pathDate = extractDateFromPath(file);
        if (pathDate) {
          year = pathDate.year;
          month = pathDate.month;
        } else {
          console.warn(`⚠️  Could not extract date from ${file}, skipping...`);
          continue;
        }
      }

      const matches = [...content.matchAll(IMAGE_REGEX)];
      
      if (matches.length === 0) {
        console.log(`   No images found in this file`);
      } else {
        console.log(`   Found ${matches.length} image(s)`);
        fileHasImages = true;
      }

      for (const match of matches) {
        const [fullMatch, altText, imagePath] = match;
        
        // Only process local images that start with /images/
        if (!imagePath.startsWith('/images/')) {
          console.log(`   ⏭️  Skipping non-local image: ${imagePath}`);
          continue;
        }

        const imageName = path.basename(imagePath);
        const localImagePath = path.join(staticImagesPath, imageName);
        
        // Check if image exists locally
        if (!(await fileExists(localImagePath))) {
          console.warn(`   ⚠️  Image file not found: ${localImagePath}`);
          totalErrors++;
          continue;
        }

        // Check if already uploaded
        if (state[localImagePath]) {
          console.log(`   ✅ Already uploaded: ${imageName}`);
          const cdnUrl = state[localImagePath];
          content = content.replace(fullMatch, `![${altText}](${cdnUrl})`);
          modified = true;
          totalSkipped++;
          continue;
        }

        try {
          console.log(`   📤 Uploading: ${imageName}`);
          
          // Remove extension from imageName to avoid double extensions
          const imageNameWithoutExt = imageName.replace(/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i, '');
          const publicId = `${CLOUDINARY_PREFIX}/${year}-${month}/${imageNameWithoutExt}`;
          
                  const result = await cloudinary.uploader.upload(localImagePath, {
          public_id: publicId,
          overwrite: false,
          resource_type: "auto",
          access_mode: "public"
        });

          const cdnUrl = `${CDN_BASE_URL}/${publicId}`;
          console.log(`   🎉 Success: ${cdnUrl}`);

          // Update state and content
          state[localImagePath] = cdnUrl;
          await saveState(state);

          content = content.replace(fullMatch, `![${altText}](${cdnUrl})`);
          modified = true;
          totalUploaded++;

        } catch (error) {
          console.error(`   ❌ Error uploading ${imageName}:`, error.message);
          totalErrors++;
        }
      }

      // Write updated content back to file
      if (modified) {
        await fs.writeFile(absoluteFilePath, content);
        console.log(`   💾 Updated links in ${path.basename(file)}`);
      }
      
      // Mark file as processed
      progress.processedFiles.push(absoluteFilePath);
      await saveProgress(progress);
      totalProcessed++;
      
      if (fileHasImages) {
        console.log(`   ✅ Completed processing ${path.basename(file)}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error processing file ${file}:`, error.message);
      totalErrors++;
    }
  }

  // Final summary
  console.log('\n🎉 Migration process finished!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Files processed: ${totalProcessed}/${markdownFiles.length}`);
  console.log(`   - Images uploaded: ${totalUploaded}`);
  console.log(`   - Images skipped (already uploaded): ${totalSkipped}`);
  console.log(`   - Errors: ${totalErrors}`);
  
  if (totalErrors > 0) {
    console.log(`\n⚠️  There were ${totalErrors} errors. You can re-run the script to retry failed uploads.`);
  }
  
  if (totalProcessed === markdownFiles.length && totalErrors === 0) {
    console.log('\n🧹 Migration completed successfully! You can now delete the migration state files:');
    console.log(`   - ${STATE_FILE}`);
    console.log(`   - ${PROGRESS_FILE}`);
  }
}

main().catch(console.error);
