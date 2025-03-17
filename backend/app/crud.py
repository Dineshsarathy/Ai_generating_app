from sqlalchemy.orm import Session
from .models import generated_data

def save_generated_data(db: Session, prompt, text=None, image_url=None, content=None, file_path=None, extracted_text=None):
    new_entry = generated_data(
        prompt=prompt,
        generated_text=text,
        generated_image=image_url,
        generated_content=content,
        uploaded_file_path=file_path,
        extracted_text=extracted_text
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def get_all_generated_data(db: Session):
    return db.query(generated_data).all()

from sqlalchemy.orm import Session
from .models.user import User
from passlib.context import CryptContext

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ========== USER AUTHENTICATION CRUD FUNCTIONS ==========

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, username: str, email: str, password: str):
    hashed_password = pwd_context.hash(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


