from fastapi import FastAPI, Form, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
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

class Status(str, Enum):
    pending = "pending"
    paid = "paid"

class InvoiceBase(BaseModel):
    customerId: str
    amount: float
    status: Status

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(InvoiceBase):
    pass

ITEMS_PER_PAGE = 100

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