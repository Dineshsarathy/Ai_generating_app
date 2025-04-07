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
import uuid
from diffusers import DiffusionPipeline

# Optimized for Low RAM Usage
pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1-base",
    torch_dtype=torch.float32,  # Reduces memory usage
    safety_checker=None,  # Disables safety checks (optional)
).to("cpu")  # Ensure it runs on CPU

OUTPUT_DIR = "static"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Define styles for different effects
STYLE_PRESETS = {
    "Realistic": "A high-resolution, ultra-realistic image of",
    "Anime": "An anime-style illustration of",
    "Cartoon": "A colorful cartoon drawing of",
    "Fantasy": "A fantasy-themed artwork of",
}

def generate_image(prompt, style="Realistic"):
    try:
        # Apply selected style
        style_prompt = f"{STYLE_PRESETS.get(style, 'A high-quality image of')} {prompt}"

        print(f"Generating image with prompt: {style_prompt}")
        image = pipe(style_prompt).images[0]

        # Generate a unique filename to avoid overwriting images
        unique_filename = f"generated_{uuid.uuid4().hex[:8]}.png"
        image_path = os.path.join(OUTPUT_DIR, unique_filename)

        image.save(image_path)
        print(f"✅ Image saved at: {image_path}")  
        return image_path
    except torch.cuda.OutOfMemoryError:
        print("❌ Out of memory error! Reduce model size or upgrade RAM.")
        return None
    except Exception as e:
        print(f"❌ Error generating image: {e}")
        return None