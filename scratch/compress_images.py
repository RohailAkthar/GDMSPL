import os
import sys
import subprocess

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def compress_image(file_path):
    try:
        orig_size = os.path.getsize(file_path)
        if orig_size < 150 * 1024:  # Skip files that are already small (under 150KB)
            return
        
        # Load image
        img = Image.open(file_path)
        fmt = img.format
        if not fmt:
            return
        
        # Resize if width or height is larger than 1200px
        max_size = 1200
        w, h = img.size
        if w > max_size or h > max_size:
            if w > h:
                new_w = max_size
                new_h = int(h * (max_size / w))
            else:
                new_h = max_size
                new_w = int(w * (max_size / h))
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Keep transparency channel for PNGs if they are in RGBA mode
        if fmt == 'PNG':
            img.save(file_path, format='PNG', optimize=True)
        elif fmt in ['JPEG', 'JPG'] or img.mode == 'RGB':
            img.save(file_path, format='JPEG', quality=70, optimize=True)
        else:
            img.save(file_path, format=fmt, optimize=True)
            
        new_size = os.path.getsize(file_path)
        reduction = ((orig_size - new_size) / orig_size) * 100
        print(f"Compressed {os.path.basename(file_path)}: {orig_size/1024/1024:.2f}MB -> {new_size/1024/1024:.2f}MB (-{reduction:.1f}%)")
    except Exception as e:
        print(f"Failed to compress {file_path}: {e}")

def main():
    assets_dir = 'src/assets'
    print(f"Scanning {assets_dir} for large images...")
    for root, dirs, files in os.walk(assets_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                file_path = os.path.join(root, file)
                compress_image(file_path)
    print("Image compression finished!")

if __name__ == '__main__':
    main()
