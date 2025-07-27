import jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import FastAPI, Form, HTTPException, Depends, Query, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from enum import Enum
from datetime import date
import asyncpg
import os

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv('..\.env')
DATABASE_URL = os.getenv("POSTGRES_URL")
ssl_mode = "require"

async def get_db():
    
    return await asyncpg.connect(DATABASE_URL, ssl=ssl_mode)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class User(BaseModel):
    name: str
    email: str | None = None
    disabled: bool | None = None


class UserInDB(User):
    hashed_password: str

@app.post("/init_database")
async def init_database():
    db = await get_db()
    try:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS appliicants (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                contact_no VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                date_of_birth DATE NOT NULL,
                education VARCHAR(255) NOT NULL,
                experience VARCHAR(255) NOT NULL,
                skills TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()
    return {"message": "Database initialized successfully."}

@app.get("/applicants")
async def get_all_applicants():
    db = await get_db()
    try:
        data = await db.fetch("SELECT * FROM appliicants")
        return [dict(row) for row in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.get("/applicants/{applicant_id}")
async def get_applicant(applicant_id: int):
    db = await get_db()
    try:
        data = await db.fetchrow("SELECT * FROM appliicants WHERE id = $1", applicant_id)
        if not data:
            raise HTTPException(status_code=404, detail="Applicant not found")
        return dict(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.post("/create_applicant")
async def create_applicant(
    name: str = Form(...),
    contact_no: str = Form(...),
    email: str = Form(...),
    date_of_birth: date = Form(...),
    education: str = Form(...),
    experience: str = Form(...),
    skills: str = Form(...)
):
    db = await get_db()
    try:
        await db.execute("""
            INSERT INTO appliicants (name, contact_no, email, date_of_birth, education, experience, skills)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """, name, contact_no, email, date_of_birth, education, experience, skills)
        return {"message": "Applicant created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()


@app.post("/add_example_applicant")
async def add_example_applicant():
    db = await get_db()
    try:
        await db.execute("""
            INSERT INTO appliicants (name, contact_no, email, date_of_birth, education, experience, skills)
            VALUES ('John Doe', '1234567890', 'john.doe@example.com', '1990-01-01', 'Bachelor of Science', '5 years', 'Python, FastAPI');
            INSERT INTO appliicants (name, contact_no, email, date_of_birth, education, experience, skills)
            VALUES ('Jane Smith', '0987654321', 'jane.smith@example.com', '1992-02-02', 'Master of Arts', '3 years', 'JavaScript, React');
            INSERT INTO appliicants (name, contact_no, email, date_of_birth, education, experience, skills)
            VALUES ('Alice Johnson', '1122334455', 'alice.johnson@example.com', '1994-03-03', 'PhD in Computer Science', '2 years', 'Machine Learning, Python');
            INSERT INTO appliicants (name, contact_no, email, date_of_birth, education, experience, skills)
            VALUES ('Bob Brown', '5566778899', 'bob.brown@example.com', '1995-04-04', 'Bachelor of Arts', '4 years', 'Graphic Design, Adobe Photoshop');
        """)
        return {"message": "Example applicant added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.post("/update_applicant/{applicant_id}")
async def update_applicant(
    applicant_id: int,
    name: str = Form(...),
    contact_no: str = Form(...),
    email: str = Form(...),
    date_of_birth: date = Form(...),
    education: str = Form(...),
    experience: str = Form(...),
    skills: str = Form(...)
):
    db = await get_db()
    try:
        await db.execute("""
            UPDATE appliicants
            SET name = $1, contact_no = $2, email = $3, date_of_birth = $4, education = $5, experience = $6, skills = $7
            WHERE id = $8
        """, name, contact_no, email, date_of_birth, education, experience, skills, applicant_id)
        return {"message": "Applicant updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.delete("/delete_applicant/{applicant_id}")
async def delete_applicant(applicant_id: int):
    db = await get_db()
    try:
        await db.execute("DELETE FROM appliicants WHERE id = $1", applicant_id)
        return {"message": "Applicant deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, email: str):
    if email in db:
        user_dict = db[email]
        return UserInDB(**user_dict)


def authenticate_user(user_db_row, email: str, password: str):
    if user_db_row is None:
        return False

    hashed_password = user_db_row['hashed_password']
    if not verify_password(password, hashed_password):
        return False

    return UserInDB(
        name=user_db_row['name'],
        email=user_db_row['email'],
        full_name=None,
        disabled=user_db_row['disabled'],
        hashed_password=hashed_password
    )



def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("AUTH_SECRET"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv("AUTH_SECRET"), algorithms=[os.getenv("ALGORITHM")])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    db = await get_db()
    user_db = db.fetchrow("SELECT * FROM users WHERE email = $1", token_data.email)
    user = get_user(user_db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.post("/init_admindb")
async def init_admindb():
    db = await get_db()
    try:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                hashed_password VARCHAR(255) NOT NULL,
                disabled BOOLEAN DEFAULT FALSE
            );
            """)
        hashed_password = get_password_hash("chris@123")
        # await db.execute("""
        #     DELETE FROM users WHERE name = 'chisphung';
        # """)
        await db.execute("""
            INSERT INTO users (name, email, hashed_password, disabled)
            VALUES ('chisphung', 'chisphung@example.com', $1, FALSE)
        """, hashed_password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()
    return {"message": "Admin database initialized successfully."}

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    # db = await get_db()
    # await db.close()
    db = await get_db()
    user_db = await db.fetchrow("SELECT * FROM users WHERE email = $1", form_data.username)
    # print(user_db)
    # print(f"hashed_password:{get_password_hash(form_data.password)}")
    user = authenticate_user(user_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.email}]

@app.post("/auth/login")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    db = await get_db()
    user_db = await db.fetchrow("SELECT * FROM users WHERE email = $1", form_data.username)
    user = authenticate_user(user_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    print("Successfully logged in")
    return {"access_token": access_token, "token_type": "bearer"}