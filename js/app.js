// লোকাল স্টোরেজ থেকে উইশলিস্টের ডাটা গেট করা
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// ১. উইশলিস্টে প্রোডাক্ট অ্যাড করার ফাংশন (শপ পেজের জন্য)
function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert("প্রোডাক্টটি উইশলিস্টে যোগ করা হয়েছে!");
    } else {
        alert("প্রোডাক্টটি ইতিমধ্যেই উইশলিস্টে আছে!");
    }
}

// ২. উইশলিস্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন (উইশলিস্ট পেজের জন্য)
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist(); // উইশলিস্ট পেজ রি-রেন্ডার করা
}

// ৩. উইশলিস্ট পেজে প্রোডাক্টগুলো দেখানোর ফাংশন
function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist-items-container');
    if (!wishlistContainer) return; // যদি উইশলিস্ট পেজে না থাকে, তবে কোড এখানেই থেমে যাবে

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `<p style="text-align:center; color:rgba(255,255,255,0.5); width:100%;">Your wishlist is empty.</p>`;
        return;
    }

    wishlist.forEach(productId => {
        // product.js এর products অ্যারে থেকে প্রোডাক্ট খুঁজে বের করা
        const product = products.find(p => p.id === productId);

        if (product) {
            wishlistContainer.innerHTML += `
                <div class="wishlist-card">
                    <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">&times;</button>
                    <div class="img-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <h3>${product.name}</h3>
                    <p class="price">৳ ${product.price}</p>
                    <button class="btn-premium" onclick="addToCart(${product.id})">ADD TO CART</button>
                </div>
            `;
        }
    });
}

// পেজ লোড হলে উইশলিস্ট দেখানোর জন্য
document.addEventListener("DOMContentLoaded", displayWishlist);
// মাউসের সাথে লাইট মুভ করার ম্যাজিক কোড
document.addEventListener("DOMContentLoaded", () => {
  // ১. স্ক্রিনে গ্লো লাইটের জন্য একটা নতুন উপাদান তৈরি করা
  const glowLight = document.createElement("div");
  glowLight.classList.add("cursor-glow");
  document.body.appendChild(glowLight);

  // ২. মাউস যেখানে যাবে, লাইটের পজিশন সেখানে সেট করা
  document.addEventListener("mousemove", (e) => {
    glowLight.style.left = e.clientX + "px";
    glowLight.style.top = e.clientY + "px";
  });
});
// সাপোর্ট ফর্ম হ্যান্ডেল করার কোড
const supportForm = document.getElementById('support-form');
if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('support-name').value;
        const email = document.getElementById('support-email').value;
        const message = document.getElementById('support-message').value;

        // সাময়িকভাবে একটি সফল অ্যালার্ট দেখানো হচ্ছে
        alert(`Thank you, ${name}! Your support ticket has been received. We will get back to you at ${email} shortly.`);
        
        // ফর্ম ক্লিয়ার করা
        supportForm.reset();
    });
}