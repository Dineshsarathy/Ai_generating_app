from pydantic import BaseModel
from typing import Optional

from pydantic import BaseModel, EmailStr
from typing import Optional

# ========== User Authentication Schemas ==========
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True  # Allows SQLAlchemy model compatibility

# ========== AI Data Generation Schema ==========
class GeneratedDataCreate(BaseModel):
    prompt: str
    generated_text: Optional[str] = None
    generated_image: Optional[str] = None
    generated_content: Optional[str] = None
    generated_video: Optional[str] = None
