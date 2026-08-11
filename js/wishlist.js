document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    if (!wishlistContainer) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `<p style="text-align: center; color: #888; padding: 40px;">Your wishlist is empty.</p>`;
        return;
    }

    wishlistContainer.innerHTML = "";
    wishlist.forEach(product => {
        wishlistContainer.innerHTML += `
            <div class="product-card" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover; margin-bottom: 15px; border-radius: 4px;">
                <h3 style="font-size: 16px; color: #fff; margin-bottom: 10px;">${product.name}</h3>
                <p style="color: #bbb; margin-bottom: 15px;">৳ ${product.price}</p>
                <button onclick="removeFromWishlist(${product.id})" style="background: #ff4d4d; color: #fff; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; font-weight: bold;">Remove</button>
            </div>
        `;
    });
});

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    location.reload();
}