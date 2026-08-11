const products = [
    {
        id: 1,
        name: "Spider-Man Brand New Day Edition",
        price: 399,
        image: "images/img/products/product-01.jpg",
        sizes: ["M", "L"]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
    if (!productContainer) return;

    productContainer.innerHTML = "";
    products.forEach(product => {
        let sizeOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join("");

        productContainer.innerHTML += `
            <div class="product-card" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; text-align: center; border-radius: 10px; max-width: 320px; margin: 0 auto;">
                
                <!-- ইমেজ বক্স যেন বেশি বড় না হয়ে একদম পারফেক্ট দেখায় -->
                <div style="width: 100%; height: 280px; overflow: hidden; border-radius: 6px; margin-bottom: 15px; background: #000;">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain; object-position: center;" loading="lazy">
                </div>

                <h3 style="font-size: 16px; margin-bottom: 8px; color: #fff; font-weight: 600;">${product.name}</h3>
                <p style="font-size: 15px; color: #bbb; margin-bottom: 15px;">৳ ${product.price}</p>
                
                <div style="margin: 15px 0;">
                    <label style="font-size: 13px; color: #aaa; margin-right: 5px;">Size: </label>
                    <select id="size-${product.id}" style="padding: 6px 12px; background: #111; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer;">
                        ${sizeOptions}
                    </select>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="addToCartWithSelectedSize(${product.id})" style="flex: 2; padding: 10px; background: #fff; color: #000; border: none; cursor: pointer; font-weight: bold; border-radius: 4px; transition: 0.3s;">Add to Cart</button>
                    <button onclick="addToWishlist(${product.id})" style="flex: 1; padding: 10px; background: #222; color: #fff; border: 1px solid #444; cursor: pointer; font-weight: bold; border-radius: 4px;">Wishlist</button>
                </div>
            </div>
        `;
    });
});