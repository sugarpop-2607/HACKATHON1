from pydantic import BaseModel
from typing import List 
import typing
class vendor(BaseModel):
    name:str
    email: str
    phone: str
    company: str
    rating: float
class quote_item(BaseModel):
    item_name: str
    item_description: str
    item_price: float
    item_quantity: int
class quotation(BaseModel):
    vendor_name: str
    quotation_number: str
    items: List[quote_item]
    total_amount: float
    delivery_days: str
    warranty_period: str
    validity_period: str
    payment_terms: str
class compare_result(BaseModel):
    best_vendor:str
    score: float
    reasoning: str