import os
from app.utils.file_handling import save_uploaded_file


STATIC_DIR = "app/static"

def generate_text(prompt):
    return f"AI-generated text for prompt: {prompt}"

def generate_image(prompt):
    image_filename = f"{prompt.replace(' ', '_')}.png"
    image_path = os.path.join(STATIC_DIR, image_filename)

    # Simulate image generation (replace with real AI model)
    with open(image_path, "w") as f:
        f.write("Simulated AI image data")

    return f"/static/{image_filename}"
