// আপনার শপের প্রোডাক্ট লিস্ট (প্রয়োজনে এখানে প্রোডাক্ট বাড়াতে বা কমাতে পারেন)
const products = [
    {
        id: 1,
        name: "Skysion Signature Oversized Tee",
        price: 1250,
        image: "images/img/products/p1.jpeg"
    },
    {
        id: 2,
        name: "Classic Black Heavyweight Hoodie",
        price: 2400,
        image: "images/img/products/p2.jpeg"
    },
    {
        id: 3,
        name: "Minimalist Aesthetic Cargo Pants",
        price: 2100,
        image: "images/img/products/p3.jpeg"
    },
    {
        id: 4,
        name: "Vintage Washed Denim Jacket",
        price: 3200,
        image: "images/img/products/p4.jpeg"
    }
];

// শপ পেজে প্রোডাক্ট কার্ডগুলো অটোমেটিক শো করানোর জন্য
document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
    if (!productContainer) return;

    productContainer.innerHTML = "";
    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <p>৳ ${product.price}</p>
                
                <div class="size-selector">
                    <label style="font-size: 13px; color: #aaa;">Size:</label>
                    <select id="size-${product.id}">
                        <option value="S">S</option>
                        <option value="M" selected>M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>

                <button class="add-to-cart-btn" onclick="addToCartWithSelectedSize(${product.id})">Add to Cart</button>
            </div>
        `;
    });
});