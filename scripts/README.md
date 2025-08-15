# Scripts Directory

This directory contains utility scripts for the AIEngineerGuide blog.

## Image Migration to Cloudinary

The `migrate-images-to-cloudinary.mjs` script automatically migrates local images to Cloudinary and updates markdown files with CDN links.

### Prerequisites

1. **Node.js** with ESM support (already configured)
2. **Cloudinary Account** - Sign up at [cloudinary.com](https://cloudinary.com)
3. **Environment Variables** - Copy `.env.example` to `.env` and fill in your Cloudinary credentials

### Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your Cloudinary credentials:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

3. Install dependencies (if not already installed):
```bash
npm install
```

### Running the Migration

```bash
npm run migrate:images
```

### How it Works

1. **Scans** all markdown files in `content/blog/`
2. **Finds** images referenced as `![alt text](/images/filename.png)`
3. **Uploads** images to Cloudinary under `AIEngineerGuide/images/YYYY-MM/filename.png`
4. **Replaces** local links with CDN links: `https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/YYYY-MM/filename.png`
5. **Saves** progress for resumability

### Features

- ✅ **Resumable** - Can be stopped and restarted without losing progress
- ✅ **State tracking** - Avoids re-uploading already processed images
- ✅ **Date extraction** - Gets year/month from frontmatter or file path
- ✅ **Error handling** - Continues processing even if some images fail
- ✅ **Detailed logging** - Shows progress with emojis and clear status
- ✅ **Local file verification** - Checks if images exist before uploading

### File Structure

After migration, images will be organized in Cloudinary as:
```
AIEngineerGuide/
└── images/
    ├── 2024-12/
    │   └── image1.png
    ├── 2024-09/
    │   └── image2.png
    ├── 2025-07/
    │   └── image3.png
    └── 2025-08/
        └── image4.png
```

### State Files

The script creates two state files for resumability:
- `migration-state.json` - Maps local image paths to CDN URLs
- `migration-progress.json` - Tracks which files have been processed

These can be safely deleted after successful migration.

### Troubleshooting

- **Missing images**: Check that images exist in `static/images/`
- **Cloudinary errors**: Verify your credentials and account limits
- **Date extraction issues**: Ensure files have dates in frontmatter or follow the `YYYY-MM/` directory pattern
- **Resume after failure**: Simply run the script again - it will skip already processed files

### Example Output

```
🚀 Starting image migration to Cloudinary...
📂 Static images directory: /path/to/static/images
📄 Found 150 markdown files

📖 Processing file: ../content/blog/2025-08/13-openai-models-free-github.md
   Found 2 image(s)
   📤 Uploading: 2025-08-13-at-23.47.21-at-2x.png
   🎉 Success: https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025/08/2025-08-13-at-23.47.21-at-2x.png
   📤 Uploading: 2025-08-13-at-23.29.36-at-2x.png
   🎉 Success: https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025/08/2025-08-13-at-23.29.36-at-2x.png
   💾 Updated links in 13-openai-models-free-github.md
   ✅ Completed processing 13-openai-models-free-github.md

🎉 Migration process finished!

📊 Summary:
   - Files processed: 150/150
   - Images uploaded: 45
   - Images skipped (already uploaded): 0
   - Errors: 0
``` 
