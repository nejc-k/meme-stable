from PIL import ImageDraw
import sys
import uuid
import torch
import diffusers
from diffusers import StableDiffusionPipeline

model_path = "./meme_model"
pipeline = StableDiffusionPipeline.from_pretrained(
    model_path,
    torch_dtype=torch.float32  # Use float32 initially for stability (change to float16 if needed)
).to("cpu")

def generate_image(text, user_id):
    image = pipeline(text).images[0]
    draw = ImageDraw.Draw(image)
    draw.text((10, 40), text, fill="black")

    unique_filename = f"{uuid.uuid4()}.png"
    temp_image_path = f"./public/images/{user_id}/{unique_filename}"
    
    image.save(temp_image_path)
    image_path = temp_image_path[9::]
    return image_path

if __name__ == "__main__":
    text = sys.argv[1] if len(sys.argv) > 1 else "Hello!"
    user_id = sys.argv[2]
    image_path = generate_image(text, user_id)
    print(image_path)  
