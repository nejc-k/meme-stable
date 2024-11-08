from PIL import Image, ImageDraw
import sys
import uuid

def generate_image(text):
    width, height = 200, 100
    image = Image.new("RGB", (width, height), color="yellow")
    draw = ImageDraw.Draw(image)
    draw.text((10, 40), text, fill="black")

    unique_filename = f"{uuid.uuid4()}.png"
    temp_image_path = f"python/tmp/{unique_filename}"
    
    image.save(temp_image_path)
    return temp_image_path

if __name__ == "__main__":
    text = sys.argv[1] if len(sys.argv) > 1 else "Hello!"
    image_path = generate_image(text)
    print(image_path)  
