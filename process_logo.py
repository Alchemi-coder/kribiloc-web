from PIL import Image, ImageDraw
import numpy as np

def process_logo(input_path, output_path, border_radius_ratio=0.15):
    # Open image
    img = Image.open(input_path).convert('RGBA')
    
    # Convert to numpy array
    data = np.array(img)
    
    # Find bounding box of non-white pixels
    # Calculate difference from white (255, 255, 255)
    rgb = data[:,:,:3]
    white_diff = 255 - rgb
    # Sum of differences, if > threshold, it's not white
    non_white = np.sum(white_diff, axis=2) > 30
    
    # Get coordinates of non-white pixels
    coords = np.argwhere(non_white)
    
    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)
    
    # Crop to the bounding box
    cropped = img.crop((x0, y0, x1, y1))
    
    # Make sure it's square
    w, h = cropped.size
    size = min(w, h)
    
    # Center crop if not perfectly square
    left = (w - size) // 2
    top = (h - size) // 2
    cropped = cropped.crop((left, top, left + size, top + size))
    
    # Create a mask for rounded corners
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    
    # Calculate corner radius based on image size
    radius = int(size * border_radius_ratio)
    
    # Draw rounded rectangle on mask
    draw.rounded_rectangle([(0, 0), (size-1, size-1)], radius=radius, fill=255)
    
    # Apply mask
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(cropped, (0, 0), mask=mask)
    
    # Save the result
    result.save(output_path, 'PNG')
    print(f'Saved {output_path}')

input_image = r'C:\Users\EVERMATE\.gemini\antigravity\brain\32e5d024-770f-469c-8778-a7767e231ade\.user_uploaded\media_1788209812649.jpg'

# Save to public directory
process_logo(input_image, r'public\logo-kribiloc.png')

# Save to app directory for favicon
# Using a slightly larger padding if needed, but Next.js automatically resizes icon.png to fill the favicon.
# We'll just copy the exact same file to icon.png
process_logo(input_image, r'src\app\icon.png')

