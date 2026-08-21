from fastapi import FastAPI
from pydant import vendor
from database import get_vendors, save_vendor
from fastapi import File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ai_imp import compare_quotations as ai_compare_quotations
import os
import glob
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


@app.post("/compare_quotations")
async def compare_quotation_files(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    file3: UploadFile = File(...)
):
    file_paths = []

    for file in [file1, file2, file3]:
        file_path = f"uploads/{file.filename}"

        with open(file_path, "wb") as f:
            f.write(await file.read())

        file_paths.append(file_path)

    result = ai_compare_quotations(file_paths)

    return result
import os
import glob

@app.get("/test_compare")
def test_compare():

    base_dir = os.path.dirname(os.path.abspath(__file__))
    upload_dir = os.path.join(base_dir, "uploads")

    files = glob.glob(os.path.join(upload_dir, "*.pdf"))

    print("PDF FILES FOUND:", files)

    if len(files) < 3:
        return {"error": f"Only found {len(files)} PDF files", "files": files}

    return ai_compare_quotations(files[:3])