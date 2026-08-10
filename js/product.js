const products = [
    {
        id: 1,
        name: "SILK SKYSION SHIRT",
        image: "images/img/products/product-1.jpg", 
        price: 499,
        sizes: ["M", "L", "XL", "XXL"],
        stock: 12
    },
    {
        id: 2,
        name: "OBSIDIAN OVERSIZED HOODIE",
        image: "images/img/products/product-2.jpg", 
        price: 499,
        sizes: ["M", "L", "XL", "XXL"],
        stock: 8
    },
    {
        id: 3,
        name: "PREMIUM SKYSION JACKET",
        image: "images/img/products/product-3.jpg", 
        price: 499,
        sizes: ["L", "XL", "XXL"],
        stock: 5
    },
    {
        id: 4,
        name: "STANDARD SKYSION T-SHIRT",
        image: "images/img/products/product-4.png", 
        price: 499,
        sizes: ["M", "L", "XL"],
        stock: 15
    },
    {
        id: 5,
        name: "DELUXE SKYSION SHIRT",
        image: "images/img/products/product-5.png",
        price: 499,
        sizes: ["M", "L", "XL", "XXL"],
        stock: 10
    },
    {  
        id: 6,
        name: "DELUXE SKYSION SHIRT",
        image: "images/img/products/product-6.png",
        price: 499,
        sizes: ["M", "L", "XL"],
        stock: 7
    },
    {         
        id: 7,
        name: "DELUXE SKYSION SHIRT",
        image: "images/img/products/product-7.png",
        price: 499,
        sizes: ["L", "XL", "XXL"],
        stock: 4
    },
    {         
        id: 8,
        name: "DELUXE SKYSION SHIRT",
        image: "images/img/products/product-8.png",
        price: 499,
        sizes: ["M", "L", "XL", "XXL"],
        stock: 20
    }
];

function displayProducts() {
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.innerHTML = ""; 
        products.forEach(product => {
            // সাইজগুলোর অপশন নিখুঁতভাবে তৈরি করার জন্য আলাদা লজিক
            let sizeOptionsHTML = "";
            if (product.sizes && product.sizes.length > 0) {
                product.sizes.forEach(size => {
                    sizeOptionsHTML += `<option value="${size}">${size}</option>`;
                });
            }

            // স্টক স্ট্যাটাস টেক্সট ও কালার
            let stockStatus = product.stock > 0 
                ? `<span style="color: #4ade80; font-size: 11px;">In Stock (${product.stock})</span>` 
                : `<span style="color: #f87171; font-size: 11px;">Out of Stock</span>`;

            // প্রোডাক্ট কার্ড রেন্ডার
            productContainer.innerHTML += `
                <div class="product-card">
                    <div class="img-container">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p class="price">৳ ${product.price}</p>
                        
                        <!-- স্টক এবং সাইজ ড্রপডাউন সেকশন -->
                        <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center;">
                            <div>${stockStatus}</div>
                            <div class="size-selector">
                                <select id="size-${product.id}" style="background: #0b0203; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                                    ${sizeOptionsHTML}
                                </select>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                            <button class="btn-premium" onclick="addToCartWithSelectedSize(${product.id})" ${product.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>ADD TO CART</button>
                            <button class="btn-premium" style="background: transparent; border: 1px solid #d12e43; color: #d12e43;" onclick="addToWishlist(${product.id})">♥</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

document.addEventListener("DOMContentLoaded", displayProducts);