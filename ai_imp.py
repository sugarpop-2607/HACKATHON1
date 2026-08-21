from google import genai
import json
client = genai.Client(api_key="AQ.Ab8RN6Ksk6ABPEPinxF_xsBce7jq1SQ25iuoRUR3Q4TwGOxjag")
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

def compare_quotations(file_paths):

    uploaded_files = []

    for path in file_paths:
        uploaded_files.append(
            client.files.upload(file=path)
        )

    prompt = """
    You are an AI procurement decision assistant.

    Analyze all the vendor quotation documents provided.

    Compare vendors based on:
    1. Total price
    2. Delivery time
    3. Warranty
    4. Payment terms
    5. Overall value

    Select the BEST vendor.

    Return JSON with exactly these fields:

    {
        "best_vendor": "...",
        "score": 0,
        "reasoning": "...",
        "comparison": [
            {
                "vendor": "...",
                "price": "...",
                "delivery": "...",
                "warranty": "..."
            }
        ]
    }
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=uploaded_files + [prompt]
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text[7:]

    if text.endswith("```"):
        text = text[:-3]

    return json.loads(text.strip())






