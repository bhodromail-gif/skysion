// উইশলিস্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert("Product added to Wishlist!");
    } else {
        alert("Product is already in your Wishlist!");
    }
}

// উইশলিস্ট পেজে প্রোডাক্ট দেখানোর ফাংশন
function displayWishlist() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:rgba(255,255,255,0.5);">Your wishlist is empty.</p>`;
        return;
    }

    wishlist.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (product) {
            container.innerHTML += `
                <div class="wishlist-card">
                    <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">&times;</button>
                    <div class="img-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <h3>${product.name}</h3>
                    <p class="price">৳ ${product.price}</p>
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn" style="background:#58111a; color:#fff; border:none; padding:10px 20px; cursor:pointer; width:100%;">Add to Cart</button>
                </div>
            `;
        }
    });
}

// উইশলিস্ট থেকে প্রোডাক্ট সরানোর ফাংশন
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist(); // রিফ্রেশ
}

// পেজ লোড হলে উইশলিস্ট দেখাবে
document.addEventListener("DOMContentLoaded", displayWishlist);