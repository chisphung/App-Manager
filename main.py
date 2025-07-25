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

load_dotenv('.env')
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

@app.get("/revenue")
async def get_revenue():
    db = await get_db()
    try:
        data = await db.fetch("SELECT * FROM revenue")
        return [dict(row) for row in data]
    finally:
        await db.close()

@app.get("/invoices")
async def get_all_invoices():
    db = await get_db()
    try:
        data = await db.fetch("""
            SELECT invoices.id, invoices.amount, invoices.date, invoices.status,
                   customers.name, customers.email, customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
        """)
        return [dict(row) for row in data]
    finally:
        await db.close()

@app.get("/invoices/latest")
async def get_latest_invoices():
    db = await get_db()
    try:
        data = await db.fetch("""
            SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
            LIMIT 5
        """)
        return [dict(row) for row in data]
    finally:
        await db.close()

@app.get("/cards")
async def get_card_data():
    db = await get_db()
    try:
        invoice_count = await db.fetchval("SELECT COUNT(*) FROM invoices")
        customer_count = await db.fetchval("SELECT COUNT(*) FROM customers")
        status_sum = await db.fetchrow("""
            SELECT
                SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
                SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
            FROM invoices
        """)
        return {
            "numberOfInvoices": invoice_count,
            "numberOfCustomers": customer_count,
            "totalPaidInvoices": status_sum["paid"],
            "totalPendingInvoices": status_sum["pending"],
        }
    finally:
        await db.close()

@app.get("/invoices/filter")
async def filter_invoices(query: str = '', page: int = 1):
    db = await get_db()
    offset = (page - 1) * ITEMS_PER_PAGE
    try:
        invoices = await db.fetch("""
            SELECT invoices.id, invoices.amount, invoices.date, invoices.status,
                   customers.name, customers.email, customers.image_url
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE customers.name ILIKE $1 OR
                  customers.email ILIKE $1 OR
                  invoices.amount::text ILIKE $1 OR
                  invoices.date::text ILIKE $1 OR
                  invoices.status ILIKE $1
            ORDER BY invoices.date DESC
            LIMIT $2 OFFSET $3
        """, f"%{query}%", ITEMS_PER_PAGE, offset)
        return [dict(row) for row in invoices]
    finally:
        await db.close()

@app.get("/invoices/pages")
async def invoice_pages(query: str = ''):
    db = await get_db()
    try:
        count = await db.fetchval("""
            SELECT COUNT(*)
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE customers.name ILIKE $1 OR
                  customers.email ILIKE $1 OR
                  invoices.amount::text ILIKE $1 OR
                  invoices.date::text ILIKE $1 OR
                  invoices.status ILIKE $1
        """, f"%{query}%")
        return {"totalPages": (count + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE}
    finally:
        await db.close()

@app.get("/invoices/{id}")
async def get_invoice_by_id(id: str):
    db = await get_db()
    try:
        invoice = await db.fetchrow("""
            SELECT id, customer_id, amount, status FROM invoices WHERE id = $1
        """, id)
        return dict(invoice) if invoice else None
    finally:
        await db.close()

@app.get("/customers")
async def get_customers():
    db = await get_db()
    try:
        customers = await db.fetch("SELECT id, name FROM customers ORDER BY name ASC")
        return [dict(row) for row in customers]
    finally:
        await db.close()

@app.get("/customers/filter")
async def filter_customers(query: str = ''):
    db = await get_db()
    try:
        data = await db.fetch("""
            SELECT customers.id, customers.name, customers.email, customers.image_url,
                   COUNT(invoices.id) AS total_invoices,
                   SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                   SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
            FROM customers
            LEFT JOIN invoices ON customers.id = invoices.customer_id
            WHERE customers.name ILIKE $1 OR customers.email ILIKE $1
            GROUP BY customers.id, customers.name, customers.email, customers.image_url
            ORDER BY customers.name ASC
        """, f"%{query}%")
        return [dict(row) for row in data]
    finally:
        await db.close()

@app.post("/invoices/create")
async def create_invoice(
    customerId: str = Form(...),
    amount: float = Form(...),
    status: Status = Form(...),
):
    db = await get_db()
    try:
        date_today = date.today()
        amount_cents = int(amount * 100)
        await db.execute("""
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES ($1, $2, $3, $4)
        """, customerId, amount_cents, status.value, date_today)
    finally:
        await db.close()

    return RedirectResponse(url="/dashboard/invoices", status_code=303)

@app.post("/invoices/update/{id}")
async def update_invoice(
    id: str,
    customerId: str = Form(...),
    amount: float = Form(...),
    status: Status = Form(...),
):
    db = await get_db()
    try:
        amount_cents = int(amount * 100)
        await db.execute("""
            UPDATE invoices
            SET customer_id = $1, amount = $2, status = $3
            WHERE id = $4
        """, customerId, amount_cents, status.value, id)
    finally:
        await db.close()

    return RedirectResponse(url="/dashboard/invoices", status_code=303)

@app.delete("/invoices/delete/{id}")
async def delete_invoice(id: str):
    db = await get_db()
    try:
        await db.execute("DELETE FROM invoices WHERE id = $1", id)
        return {"message": "Invoice deleted"}
    finally:
        await db.close()

@app.post("/auth/login")
async def authenticate(username: str = Form(...), password: str = Form(...)):
    if username == "admin" and password == "123":
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials.")