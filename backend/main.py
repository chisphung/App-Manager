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

load_dotenv('../.env')
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
            DROP TABLE IF EXISTS applications;
            CREATE TABLE applications (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                github VARCHAR(20) NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'stopped')),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()
    return {"message": "Database initialized successfully."}

@app.get("/applications")
async def get_all_applications():
    db = await get_db()
    try:
        data = await db.fetch("SELECT * FROM applications")
        return [dict(row) for row in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.get("/applications/{application_id}")
async def get_application(application_id: int):
    db = await get_db()
    try:
        data = await db.fetchrow("SELECT * FROM applications WHERE id = $1", application_id)
        if not data:
            raise HTTPException(status_code=404, detail="Application not found")
        return dict(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.post("/create_application")
async def create_application(
    name: str = Form(...),
    github: str = Form(...),
    image_url: str = Form(...),
    status: str = Form(...),
    description: str = Form(...)
):
    db = await get_db()
    try:
        # print(Form(...))
        # print(f"Inserting application: {name}, {github}, {image_url}, {status}, {description}")
        await db.execute("""
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ($1, $2, $3, $4, $5)
        """, name, github, image_url, status, description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()
    return {"message": "Application created successfully."}

@app.post("/update_application/{application_id}")
async def update_application(
    application_id: int,
    name: str = Form(...),
    github: str = Form(...),
    image_url: str = Form(...),
    status: str = Form(...),
    description: str = Form(...)
):
    db = await get_db()
    try:
        await db.execute("""
            UPDATE applications
            SET name = $1, github = $2, image_url = $3, status = $4, description = $5
            WHERE id = $6
        """, name, github, image_url, status, description, application_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()
    return {"message": "Application updated successfully."}
@app.post("/toggle_application_status/{application_id}")
async def toggle_application_status(application_id: int):
    db = await get_db()
    try:
        data = await db.fetchrow("SELECT status FROM applications WHERE id = $1", application_id)
        if not data:
            raise HTTPException(status_code=404, detail="Application not found")

        new_status = "stopped" if data["status"] == "running" else "running"
        await db.execute("UPDATE applications SET status = $1 WHERE id = $2", new_status, application_id)
        return {"message": "Application status updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.delete("/delete_application/{application_id}")
async def delete_application(application_id: int):
    db = await get_db()
    try:
        await db.execute("DELETE FROM applications WHERE id = $1", application_id)
        return {"message": "Application deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()


@app.post("/add_example_applications")
async def add_example_applications():
    db = await get_db()
    try:
        await db.execute("""
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ('Backend app', 'https://github.com', 'https://placehold.co/600x400/6366f1/ffffff?text=Backend+app', 'running', 'this is an example application for backend app');
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ('API app', 'https://github.com', 'https://placehold.co/600x400/ef4444/ffffff?text=API+app', 'running', 'this is an example application for API app');
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ('Database app', 'https://github.com', 'https://placehold.co/600x400/4f46e5/ffffff?text=Database+app', 'running', 'this is an example application for database app');
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ('Frontend app', 'https://github.com', 'https://placehold.co/600x400/ec4899/ffffff?text=Frontend+app', 'running', 'this is an example application for frontend app');
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ('RAG app', 'https://github.com', 'https://placehold.co/600x400/f59e0b/ffffff?text=RAG+app', 'stopped', 'this is an example application for RAG app');
            INSERT INTO applications (name, github, image_url, status, description)
            VALUES ('ETL pipeline', 'https://github.com', 'https://placehold.co/600x400/10b981/ffffff?text=ETL+pipeline', 'stopped', 'this is an example application for ETL pipeline');
        """)
        return {"message": "Example applications added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await db.close()

@app.post("/update_applications/{application_id}")
async def update_application(
    application_id: int,
    name: str = Form(...),
    github: str = Form(...),
    image_url: str = Form(...),
    status: str = Form(...),
    description: str = Form(...)
):
    db = await get_db()
    try:
        await db.execute("""
            UPDATE applications
            SET name = $1, github = $2, image_url = $3, status = $4, description = $5
            WHERE id = $6
        """, name, github, image_url, status, description, application_id)
        return {"message": "Application updated successfully."}
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