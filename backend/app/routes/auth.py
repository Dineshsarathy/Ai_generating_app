from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import get_user_by_email, create_user, verify_password
from fastapi.responses import RedirectResponse
from fastapi import Request

router = APIRouter()

# Session-based user tracking
fake_session_store = {}

@router.post("/signup/")
def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = create_user(db, username, email, password)
    return {"message": "User created successfully", "username": user.username, "email": user.email}

@router.post("/login/")
def login(request: Request, email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Simulate session storage (No JWT, just a simple dictionary)
    session_id = str(user.id)
    fake_session_store[session_id] = {"username": user.username, "email": user.email}
    
    response = RedirectResponse(url="/dashboard", status_code=302)
    response.set_cookie(key="session_id", value=session_id)
    return response

@router.get("/logout/")
def logout(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id and session_id in fake_session_store:
        del fake_session_store[session_id]

    response = RedirectResponse(url="/")
    response.delete_cookie("session_id")
    return response
