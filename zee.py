from fastapi import FastAPI
from pydant import vendor
from database import get_vendors, save_vendor
from fastapi import File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ai_imp import analyze_quotation as ai_analyze_quotation
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Procurement ERP is running successfully"}

@app.post("/create_vendor")
def create_vendor(vendor_data: vendor):
    save_vendor(vendor_data)

    return {"message": "Vendor created successfully", "vendor": vendor_data}

@app.get("/vendors")
def list_vendors():
    vendors = get_vendors()
    return {"vendors": vendors}

@app.post("/analyze_quotation")
async def analyze_quotation(file: UploadFile = File(...)):
    file_path=f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write( await file.read())
    result= ai_analyze_quotation(file_path)
    return {"filename": file.filename, "result": result}