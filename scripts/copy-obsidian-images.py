import os
import re
import shutil
import subprocess

# Paths
home = os.path.expanduser("~")
posts_dir = os.path.join(home, "Code/sites/nesinio-ai/content/blog")
attachments_dir = os.path.join(home, "Sync/Notes/ai-notes/Resources/assets")
static_images_dir = os.path.join(home, "Code/sites/nesinio-ai/static/images/")

print("Home directory:", home)
print("Posts directory:", posts_dir)
print("Attachments directory:", attachments_dir)
print("Static images directory:", static_images_dir)

# Execute rsync command
rsync_command = f"rsync -av --delete '{home}/Sync/Notes/ai-notes/NesinIO-AI/content/' '{home}/Code/sites/nesinio-ai/content/'"
print("Executing rsync command:", rsync_command)
subprocess.run(rsync_command, shell=True, check=True)

# Step 1: Process each markdown file in the posts directory
for filename in os.listdir(posts_dir):
    print("Processing file:", filename)
    if filename.endswith(".md"):
        filepath = os.path.join(posts_dir, filename)
        
        with open(filepath, "r") as file:
            content = file.read()
        
        # Step 2: Find all image links in the format ![Image Description](/images/Pasted%20image%20...%20.png)
        images = re.findall(r'\[\[([^]]*\.png)\]\]', content)
        print("Found images:", images)
        # Step 3: Replace image links and ensure URLs are correctly formatted
        for image in images:
            # Prepare the Markdown-compatible link with %20 replacing spaces
            markdown_image = f"[Image Description](/images/{image.replace(' ', '%20')})"
            content = content.replace(f"[[{image}]]", markdown_image)
            
            print("markdown_image:", markdown_image)
            
            # Step 4: Copy the image to the Hugo static/images directory if it exists
            image_source = os.path.join(attachments_dir, image)
            if os.path.exists(image_source):
                shutil.copy(image_source, static_images_dir)

        # Step 5: Write the updated content back to the markdown file
        with open(filepath, "w") as file:
            file.write(content)

print("Markdown files processed and images copied successfully.")
