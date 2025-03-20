from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Dinesh%400402@postgres:5432/ai_db")


# ✅ Create Database Engine
engine = create_engine(DATABASE_URL)

# ✅ Create a SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Define Base
Base = declarative_base()

# ✅ Ensure tables are created at startup
Base.metadata.create_all(bind=engine)  # ✅ Moved from `main.py`

# ✅ Dependency for Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
