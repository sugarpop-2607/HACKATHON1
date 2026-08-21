from google import genai
import json
client = genai.Client(api_key="AQ.Ab8RN6LhvIFytRXfPJ-_If88fTIgZ10eb2SALKtdl2-ucsOCOQ")
def analyze_quotation(file_path):
    uploaded_file = client.files.upload(file=file_path)

    prompt = """
    Analyze this vendor quotation.

    Extract:
    - Vendor name
    - Quotation number
    - Product/item names
    - Quantity
    - Unit price
    - Total amount
    - Delivery time
    - Warranty
    - Payment terms
    - Validity

    Return the extracted information as JSON.
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=[uploaded_file, prompt]
    )

    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip()) 






