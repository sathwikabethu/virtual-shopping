from flask import Flask, render_template, request
app = Flask(__name__)

products = {
    "Men": [
        {"name": "Casual T-Shirt", "price": "₹799", "image": "items/men/tshirt.png"},
        {"name": "Stylish Sunglasses", "price": "₹1299", "image": "items/men/sunglasses.png"},
        {"name": "Leather Jacket", "price": "₹2499", "image": "items/men/jacket.png"}
    ],
    "Women": [
        {"name": "Elegant Necklace", "price": "₹999", "image": "items/women/necklace.png"},
        {"name": "Gold Earrings", "price": "₹1299", "image": "items/women/earrings.png"},
        {"name": "Floral Dress", "price": "₹1899", "image": "items/women/dress.png"}
    ],
    "Kids": [
        {"name": "Cool Cap", "price": "₹399", "image": "items/kids/cap.png"},
        {"name": "Cute Bow", "price": "₹299", "image": "items/kids/bow.png"},
        {"name": "Hoodie", "price": "₹699", "image": "items/kids/hoodie.png"}
    ]
}


@app.route('/')
def index():
    query = request.args.get('q', '').lower()
    filtered = {cat: [p for p in prods if query in p['name'].lower()] for cat, prods in products.items()} if query else products
    return render_template('index.html', products=filtered)


@app.route('/try_on/<category>/<item>')
def try_on(category, item):
    item_path = f"/static/items/{category}/{item}.png"
    return render_template('tryon.html', item=item_path, category=category.capitalize())

@app.route('/cart')
def view_cart():
    return render_template('cart.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000)
