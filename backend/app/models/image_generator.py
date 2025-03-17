# from diffusers import StableDiffusionPipeline
# import torch
# import os

# # Load Stable Diffusion model
# pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
# pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

# def generate_image(prompt):
#     image = pipe(prompt).images[0]
#     image_path = "static/generated_image.png"
#     image.save(image_path)
#     return image_path


import torch
import os
from diffusers import DiffusionPipeline

# Load a smaller model (this requires less RAM)
pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1-base")

OUTPUT_DIR = "static"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_image(prompt):
    try:
        image = pipe(prompt).images[0]
        image_path = os.path.join(OUTPUT_DIR, "generated_image.png")
        image.save(image_path)
        print(f"Image saved at: {image_path}")  
        return image_path
    except Exception as e:
        print(f"Error generating image: {e}")
        return None
