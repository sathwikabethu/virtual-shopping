# Run once to populate products into products.json or to setup DB. This example just writes sample products.
import json
products = [
    {"id": "p001", "name": "Red Apple", "price": 0.99, "description": "Fresh red apple"},
    {"id": "p002", "name": "Strawberry Pack", "price": 2.5, "description": "Pack of strawberries"},
    {"id": "p003", "name": "Tomato Box", "price": 1.2, "description": "Box of tomatoes"}
]
with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)
print('products.json created')
