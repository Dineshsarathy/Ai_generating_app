from sqlalchemy import Column, Integer, String, Text
from app.database import Base  


class GeneratedData(Base):
    __tablename__ = "generated_data"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text, nullable=False)
    generated_text = Column(Text, nullable=True)
    generated_image = Column(String, nullable=True)  # Image URL
    generated_content = Column(Text, nullable=True)
    uploaded_file_path = Column(String, nullable=True)  # File path
    extracted_text = Column(Text, nullable=True)  # OCR result
