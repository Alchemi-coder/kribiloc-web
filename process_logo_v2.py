from PIL import Image, ImageDraw
import numpy as np

def process_logo(input_path, output_path, border_radius_ratio=0.18):
    # Open image
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img)
    
    # Find bounding box of BLACK pixels (the background of the logo)
    # This ignores the white padding outside.
    # Black is roughly R<50, G<50, B<50
    is_black = np.all(data[:,:,:3] < 50, axis=2)
    
    coords = np.argwhere(is_black)
    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)
    
    # Add a tiny 1-2 pixel inset to ensure NO white border remains at all
    inset = 3
    x0 += inset
    y0 += inset
    x1 -= inset
    y1 -= inset
    
    # Crop exactly to the black square
    cropped = img.crop((x0, y0, x1, y1))
    
    # Make it a perfect square
    w, h = cropped.size
    size = min(w, h)
    
    left = (w - size) // 2
    top = (h - size) // 2
    cropped = cropped.crop((left, top, left + size, top + size))
    
    # Create an antialiased rounded corner mask
    mask = Image.new('L', (size * 4, size * 4), 0) # 4x supersampling for smooth corners
    draw = ImageDraw.Draw(mask)
    radius = int(size * 4 * border_radius_ratio)
    
    draw.rounded_rectangle([(0, 0), (size*4-1, size*4-1)], radius=radius, fill=255)
    mask = mask.resize((size, size), Image.Resampling.LANCZOS)
    
    # Apply mask
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(cropped, (0, 0), mask=mask)
    
    # Save the result
    result.save(output_path, 'PNG')
    print(f'Saved {output_path}')

input_image = r'C:\Users\EVERMATE\.gemini\antigravity\brain\32e5d024-770f-469c-8778-a7767e231ade\.user_uploaded\media_1788209812649.jpg'

process_logo(input_image, r'public\logo-kribiloc.png')
process_logo(input_image, r'src\app\icon.png')

