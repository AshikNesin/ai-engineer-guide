import os
import re
import shutil
import subprocess
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Paths
home = os.path.expanduser("~")
obsidian_content_dir = os.path.join(home, "Sync/Notes/ai-notes/NesinIO-AI/content/blog")
posts_dir = os.path.join(home, "Code/sites/nesinio-ai/content/blog")
attachments_dir = os.path.join(home, "Sync/Notes/ai-notes/Resources/assets")
static_images_dir = os.path.join(home, "Code/sites/nesinio-ai/static/images/")

def run_rsync():
    source = os.path.join(home, "Sync/Notes/ai-notes/NesinIO-AI/content/")
    destination = os.path.join(home, "Code/sites/nesinio-ai/content/")
    cmd = f"rsync -av --delete '{source}' '{destination}'"
    subprocess.run(cmd, shell=True, check=True)

def process_file(source_filepath):
    print(f"Processing file: {source_filepath}")
    
    # Determine the corresponding path in the posts_dir
    relative_path = os.path.relpath(source_filepath, obsidian_content_dir)
    dest_filepath = os.path.join(posts_dir, relative_path)
    
    # Ensure the destination directory exists
    os.makedirs(os.path.dirname(dest_filepath), exist_ok=True)
    
    # Copy the file from source to destination
    shutil.copy2(source_filepath, dest_filepath)
    
    # Now process the file in the posts_dir
    with open(dest_filepath, "r") as file:
        content = file.read()
    
    # Find all image links in the format [[image.png]]
    images = re.findall(r'\[\[([^]]*\.png)\]\]', content)
    print("Found images:", images)
    
    # Replace image links and ensure URLs are correctly formatted
    for image in images:
        # Prepare the Markdown-compatible link with %20 replacing spaces
        markdown_image = f"![Image Description](/images/{image.replace(' ', '%20')})"
        print(f"Generated image tag: {markdown_image}")


        content = content.replace(f"![[{image}]]", markdown_image)
        
        print("markdown_image:", markdown_image)
        
        # Copy the image to the Hugo static/images directory if it exists
        image_source = os.path.join(attachments_dir, image)
        if os.path.exists(image_source):
            shutil.copy(image_source, static_images_dir)

    # Write the updated content back to the destination markdown file
    with open(dest_filepath, "w") as file:
        file.write(content)

class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = {}

    def on_modified(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith('.md'):
            current_time = time.time()
            last_modified = self.last_modified.get(event.src_path, 0)
            if current_time - last_modified > 1:  # 1 second cooldown
                print(f"File modified: {event.src_path}")
                process_file(event.src_path)
                self.last_modified[event.src_path] = current_time

    def on_created(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith('.md'):
            print(f"File created: {event.src_path}")
            process_file(event.src_path)

if __name__ == "__main__":
    print("Home directory:", home)
    print("Posts directory:", posts_dir)
    print("Attachments directory:", attachments_dir)
    print("Static images directory:", static_images_dir)
    print("Obsidian content directory:", obsidian_content_dir)

    print("Running initial rsync...")
    run_rsync()

    print("Starting file observer...")
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, obsidian_content_dir, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
