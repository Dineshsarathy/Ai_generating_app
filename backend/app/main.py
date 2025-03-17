from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from app.database import engine, Base  # ✅ Import `engine` & `Base`
from app.routes import auth  # ✅ Import authentication routes
from app.models.image_generator import generate_image  
from app.models.text_generator import generate_text
from app.models.content_generator import generate_content  
from app.models.ocr import extract_text_from_image
from app.utils.file_handling import save_uploaded_file
from app.models.video_generator import VideoGenerator
from transformers import pipeline


app = FastAPI()

# ✅ Register Authentication Routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# ✅ Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# ✅ Root Endpoint (Fixed Duplicate Route)
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI App Backend!"}

# ✅ Serve Static Images
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Text Generation Route
text_generator = pipeline("text-generation", model="gpt2")

class TextRequest(BaseModel):
    prompt: str

@app.post("/generate-text")
async def generate_text_route(request: TextRequest):
    try:
        response = text_generator(
            request.prompt,
            max_length=500,  
            num_return_sequences=1,
            temperature=0.9,  
            top_p=0.92,  
            repetition_penalty=1.5,  
            do_sample=True  
        )
        return {"text": response[0]["generated_text"].strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Image Generation Route
class ImageRequest(BaseModel):
    prompt: str

@app.post("/generate-image")
async def generate_image_endpoint(request: ImageRequest):
    try:
        image_path = generate_image(request.prompt)

        if not image_path:
            raise HTTPException(status_code=500, detail="Image generation failed")

        filename = os.path.basename(image_path)
        return {"image_url": f"http://127.0.0.1:8000/static/{filename}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")

# ✅ Content Generation Route
class ContentRequest(BaseModel):
    prompt: str

@app.post("/generate-content")
async def generate_content_route(request: ContentRequest):
    try:
        content = generate_content(request.prompt)
        return {"content": content}
    except Exception as e:
        return {"error": str(e)}

# ✅ Video Generation Route
video_generator = VideoGenerator()

class VideoRequest(BaseModel):
    prompt: str

@app.post("/generate-video")
async def generate_video(request: VideoRequest):
    try:
        print(f"Received request: {request}")  # ✅ Log request data for debugging
        print(f"Received prompt: {request.prompt}")  # ✅ Log prompt

        output_path = video_generator.generate_video(request.prompt)
        print(f"Generated video at: {output_path}")  # ✅ Debugging

        if os.path.exists(output_path):
            return FileResponse(output_path, media_type="video/mp4", filename="output.mp4")
        else:
            raise HTTPException(status_code=500, detail="Video file not found after generation")
    except Exception as e:
        print(f"Error: {str(e)}")  # ✅ Debugging
        raise HTTPException(status_code=500, detail=str(e))



# ✅ File Upload Route (with OCR support)
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        file_path = save_uploaded_file(file)
        if not file_path:
            raise HTTPException(status_code=500, detail="File could not be saved")

        # ✅ Process image for OCR
        if file.content_type.startswith("image"):
            try:
                extracted_text = extract_text_from_image(file_path)
                return {"extracted_text": extracted_text}
            except Exception as e:
                return {"error": f"OCR failed: {str(e)}"}

        # ✅ Process text files
        else:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read()
                return {"file_content": file_content}
            except Exception as e:
                return {"error": f"Reading file failed: {str(e)}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# ✅ Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
