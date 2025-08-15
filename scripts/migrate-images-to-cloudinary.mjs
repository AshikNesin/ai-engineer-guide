
import { v2 as cloudinary } from 'cloudinary';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// --- Configuration ---
const POSTS_PATH = '../content/blog/**/*.md';
const STATE_FILE = './migration-state.json';
const IMAGE_REGEX = /![[(*?)]]|![.*?](.*?)/g;
const CLOUDINARY_PREFIX = 'AIEngineerGuide/images';
const CDN_BASE_URL = 'https://images.nesin.io/qblog';

// --- Cloudinary Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// --- Main Logic ---
async function main() {
  console.log('Starting image migration to Cloudinary...');
  const state = await loadState();
  const markdownFiles = await glob(POSTS_PATH, { cwd: path.dirname(new URL(import.meta.url).pathname) });

  for (const file of markdownFiles) {
    const absoluteFilePath = path.resolve(path.dirname(new URL(import.meta.url).pathname), file);
    console.log(`
Processing file: ${file}`);
    let content = await fs.readFile(absoluteFilePath, 'utf-8');
    let modified = false;

    const matches = [...content.matchAll(IMAGE_REGEX)];
    if (matches.length === 0) {
      continue;
    }

    const { data: frontmatter, content: pageContent } = matter(content);

    if (!frontmatter.date) {
        console.warn(`Could not find date in frontmatter for ${file}, skipping image uploads.`);
        continue;
    }

    const date = new Date(frontmatter.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');


    for (const match of matches) {
      const imagePath = match[1] || match[2]; // Support for both ![[...]] and ![]() syntax

      if (!imagePath || imagePath.startsWith('http')) {
        continue; // Skip empty or remote images
      }

      const localImagePath = path.resolve(path.dirname(absoluteFilePath), imagePath.replace(/\s/g, ' '));
      const imageName = path.basename(localImagePath);

      if (state[localImagePath]) {
        console.log(`  - Skipping (already uploaded): ${imageName}`);
        content = content.replace(imagePath, state[localImagePath]);
        modified = true;
        continue;
      }

      try {
        console.log(`  - Uploading: ${imageName}`);
        
        const publicId = `${CLOUDINARY_PREFIX}/${year}/${month}/${imageName}`;
        
        const result = await cloudinary.uploader.upload(localImagePath, {
          public_id: publicId,
          overwrite: false, // Don't re-upload if it already exists on Cloudinary
        });

        const cdnUrl = `${CDN_BASE_URL}/${publicId}`;
        console.log(`    > Success: ${cdnUrl}`);

        state[localImagePath] = cdnUrl;
        await saveState(state); // Save state after each successful upload

        content = content.replace(imagePath, cdnUrl);
        modified = true;

      } catch (error) {
        console.error(`    > Error uploading ${imageName}:`, error.message);
      }
    }

    if (modified) {
      await fs.writeFile(absoluteFilePath, content);
      console.log(`  > Updated links in ${file}`);
    }
  }

  console.log('Migration process finished!');
}

main().catch(console.error);
