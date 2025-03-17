import os

# Define the upload directory
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the directory exists

def save_uploaded_file(file):
    """
    Saves an uploaded file to the UPLOAD_DIR.

    Args:
        file: The uploaded file object (FastAPI UploadFile or similar).

    Returns:
        str: The file path if saved successfully, None if an error occurs.
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        print(f"File saved successfully at: {file_path}")  # Debugging
        return file_path
    except Exception as e:
        print(f"Error saving file: {e}")
        return None
