import pytesseract
from PIL import Image
import os
import shutil
from fastapi import UploadFile

# Set the Tesseract-OCR path if required (for Windows users)
# Uncomment and set the correct path if needed
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from an image using Tesseract OCR.

    Args:
        image_path (str): Path to the image file.

    Returns:
        str: Extracted text from the image or an error message if extraction fails.
    """
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"File not found: {image_path}")

        # Open the image file
        with Image.open(image_path) as image:
            # Perform OCR using pytesseract
            extracted_text = pytesseract.image_to_string(image)

        return extracted_text.strip()  # Remove leading/trailing whitespace
    except FileNotFoundError as fnf_error:
        print(f"Error: {fnf_error}")
        return "Error: Image file not found."
    except pytesseract.TesseractError as tess_error:
        print(f"Tesseract OCR Error: {tess_error}")
        return "Error: Tesseract OCR failed."
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return "Error: Could not process the image."

def save_uploaded_file(uploaded_file: UploadFile, upload_dir="uploads") -> str:
    """
    Save an uploaded file to a local directory.

    Args:
        uploaded_file (UploadFile): The file received from FastAPI request.
        upload_dir (str): Directory to save the file.

    Returns:
        str: The saved file path or an empty string on failure.
    """
    try:
        # Ensure the upload directory exists
        os.makedirs(upload_dir, exist_ok=True)

        # Define the file path
        file_path = os.path.join(upload_dir, uploaded_file.filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(uploaded_file.file, buffer)

        return file_path
    except Exception as e:
        print(f"Error saving file: {e}")
        return ""

