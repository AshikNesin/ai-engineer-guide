import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import chokidar from "chokidar";

const execAsync = promisify(exec);

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const home = process.env.HOME || process.env.USERPROFILE;
const obsidianContentDir = path.join(
  home,
  "Sync/Notes/ai-notes/AIEngineerGuide/content/blog"
);
const postsDir = path.join(home, "Code/sites/AIEngineerGuide/content/blog");
const attachmentsDir = path.join(home, "Sync/Notes/ai-notes/Resources/assets");
const staticImagesDir = path.join(
  home,
  "Code/sites/AIEngineerGuide/static/images/"
);

async function processAllFiles(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      await processAllFiles(fullPath);
    } else if (file.isFile() && file.name.endsWith(".md")) {
      await processFile(fullPath);
    }
  }
}
async function runRsync() {
  const source = path.join(
    home,
    "Sync/Notes/ai-notes/AIEngineerGuide/content/"
  );
  const destination = path.join(home, "Code/sites/AIEngineerGuide/content/");
  const cmd = `rsync -av --delete '${source}' '${destination}'`;
  await execAsync(cmd);
  console.log("Rsync completed. Processing files...");
  await processAllFiles(postsDir);
}

async function processFile(sourceFilepath) {
  // Determine the corresponding path in the posts_dir
  // const relativePath = path.relative(obsidianContentDir, sourceFilepath);
  // const sourceFilepath = path.join(postsDir, relativePath);
  console.log(`Processing file: ${sourceFilepath}`);

  // Now process the file in the posts_dir
  let content = await fs.readFile(sourceFilepath, "utf-8");

  // Find all image links in the format ![[image.png]]
  const imageRegex = /!\[\[([^\]]+\.(png|jpg|jpeg|gif))\]\]/g;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const imageName = match[1];

    // Generate a URL-friendly image name
    const urlFriendlyName = imageName.replace(/ /g, "-").replace(/@/g, "-at-");

    const markdownImage = `![${imageName}](/images/${encodeURIComponent(
      urlFriendlyName
    )})`;
    console.log(`Generated image tag: ${markdownImage}`);

    content = content.replace(fullMatch, markdownImage);

    console.log("markdown_image:", markdownImage);

    // Copy the image to the Hugo static/images directory if it exists
    const imageSource = path.join(attachmentsDir, imageName);
    if (await fs.stat(imageSource).catch(() => false)) {
      const destImagePath = path.join(staticImagesDir, urlFriendlyName);
      await fs.copyFile(imageSource, destImagePath);
      console.log(`Copied image from ${imageSource} to ${destImagePath}`);
    } else {
      console.log(`Image not found: ${imageSource}`);
    }
  }

  // Write the updated content back to the destination markdown file
  await fs.writeFile(sourceFilepath, content);
}

async function main() {
  console.log("Home directory:", home);
  console.log("Posts directory:", postsDir);
  console.log("Attachments directory:", attachmentsDir);
  console.log("Static images directory:", staticImagesDir);
  console.log("Obsidian content directory:", obsidianContentDir);

  console.log("Running initial rsync...");
  await runRsync();

  console.log("Starting file observer...");
  const watcher = chokidar.watch(obsidianContentDir, {
    persistent: true,
    ignoreInitial: true,
  });

  const lastModified = new Map();

  watcher.on("add", processFile).on("change", (path) => {
    const currentTime = Date.now();
    const lastTime = lastModified.get(path) || 0;
    if (currentTime - lastTime > 1000) {
      // 1 second cooldown
      processFile(path);
      lastModified.set(path, currentTime);
    }
  });

  process.on("SIGINT", () => {
    watcher.close();
    process.exit(0);
  });
}

main().catch(console.error);
