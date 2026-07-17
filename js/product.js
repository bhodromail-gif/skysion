const products = [
    {
        id: 1,
        name: "SILK SKYSION SHIRT",
        image: "images/img/products/product-1.jpg", 
        price: 499
    },
    {
        id: 2,
        name: "OBSIDIAN OVERSIZED HOODIE",
        image: "images/img/products/product-2.jpg", 
        price: 499
    },
    {
        id: 3,
        name: "PREMIUM SKYSION JACKET",
        image: "images/img/products/product-3.jpg", 
        price: 499
    }
];

function displayProducts() {
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.innerHTML = ""; 
        products.forEach(product => {
            productContainer.innerHTML += `
                <div class="product-card">
                    <div class="img-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p class="price">৳ ${product.price}</p>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button class="btn-premium" onclick="addToCart(${product.id})">ADD TO CART</button>
                            <!-- উইশলিস্ট বাটন -->
                            <button class="btn-premium" style="background: transparent; border: 1px solid #d12e43; color: #d12e43;" onclick="addToWishlist(${product.id})">♥</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

document.addEventListener("DOMContentLoaded", displayProducts);