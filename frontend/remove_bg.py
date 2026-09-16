import sys
from PIL import Image, ImageDraw

def remove_background(image_path):
    img = Image.open(image_path).convert("RGBA")
    
    # We will floodfill from the 4 corners to be safe
    corners = [
        (0, 0), 
        (img.width - 1, 0), 
        (0, img.height - 1), 
        (img.width - 1, img.height - 1)
    ]
    
    for corner in corners:
        # Get the color of the corner pixel
        pixel = img.getpixel(corner)
        
        # Check if it's close to white (so we don't accidentally fill the subject if it touches corner)
        if pixel[0] > 230 and pixel[1] > 230 and pixel[2] > 230:
            ImageDraw.floodfill(img, corner, (255, 255, 255, 0), thresh=30)
            
    img.save(image_path)
    print("Background removed successfully!")

if __name__ == "__main__":
    remove_background(sys.argv[1])
