import sqlite3
db_name="quotation.db"
def create_connection():
    conn=sqlite3.connect(db_name)
    conn.row_factory=sqlite3.Row
    return conn
def create_tables():
    conn=create_connection()
    cursor=conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS vendors (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL,
                        phone TEXT NOT NULL,
                        company TEXT NOT NULL,
                        rating REAL NOT NULL
                    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS quotations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        vendor_name TEXT NOT NULL,
                        quotation_number TEXT NOT NULL,
                        total_amount REAL NOT NULL,
                        delivery_days TEXT NOT NULL,
                        warranty_period TEXT NOT NULL,
                        validity_period TEXT NOT NULL,
                        payment_terms TEXT NOT NULL
                    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS quote_items (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        quotation_id INTEGER NOT NULL,
                        item_name TEXT NOT NULL,
                        item_description TEXT NOT NULL,
                        item_price REAL NOT NULL,
                        item_quantity INTEGER NOT NULL,
                        FOREIGN KEY (quotation_id) REFERENCES quotations (id)
                    )''')
    conn.commit()
    conn.close()
if __name__ == "__main__":
    create_tables()
    print("Database created successfully")
def get_vendors():
    conn=create_connection()
    cursor=conn.cursor()
    cursor.execute("SELECT * FROM vendors")
    vendors=cursor.fetchall()
    conn.close()
    return [dict(vendor) for vendor in vendors]
def save_vendor(vendor_data):
    conn=create_connection()
    cursor=conn.cursor()
    cursor.execute('''INSERT INTO vendors (name, email, phone, company, rating)
                      VALUES (?, ?, ?, ?, ?)''',
                   (vendor_data.name, vendor_data.email, vendor_data.phone, vendor_data.company, vendor_data.rating))
    conn.commit()
    conn.close()