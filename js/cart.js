// লোকাল স্টোরেজ থেকে কার্টের ডাটা গেট করা
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ১. কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToCart(productId) {
    // product.js এর products অ্যারে থেকে প্রোডাক্টটি চেক করা
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("Product not found!");
        return;
    }

    // কার্টে প্রোডাক্টটি আগে থেকেই আছে কি না দেখা
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1; // থাকলে পরিমাণ বাড়ানো
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    // লোকাল স্টোরেজে সেভ এবং নেভিগেশন কাউন্টার আপডেট
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
    
    // যদি শপ পেজে থাকে, তবে কার্ট রি-রেন্ডার করার দরকার নেই, শুধু কাউন্ট বদলাবে
    if (document.getElementById('cart-items-body')) {
        displayCart();
    }
}

// ২. কার্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // UI এবং কাউন্টার রিফ্রেশ
    displayCart();
    updateCartCount();
}

// ৩. হেডার বা নেভিগেশন বারে কার্টের টোটাল সংখ্যা (Count) দেখানোর ফাংশন
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalItems;
    }
}

// ৪. কার্ট পেজে প্রোডাক্টের টেবিল ও টোটাল প্রাইস রেন্ডার করার ফাংশন
function displayCart() {
    const cartBody = document.getElementById('cart-items-body');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    if (!cartBody) return; // যদি কার্ট পেজে না থাকে, তবে এখান থেকেই কোড ব্যাক করবে

    cartBody.innerHTML = "";
    let grandTotal = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:rgba(255,255,255,0.4); padding: 40px 0;">Your cart is empty.</td></tr>`;
        if (totalPriceElement) totalPriceElement.innerText = "৳ ০";
        return;
    }

    cart.forEach(item => {
        // product.js এর মেইন অ্যারে থেকে প্রোডাক্টের নতুন ডেটা ম্যাচ করা
        const product = products.find(p => p.id === item.id);

        if (product) {
            let itemTotal = product.price * item.quantity;
            grandTotal += itemTotal;

            cartBody.innerHTML += `
                <tr>
                    <td>
                        <div class="cart-product-info">
                            <img src="${product.image}" alt="${product.name}">
                            <span>${product.name} ${item.quantity > 1 ? `x ${item.quantity}` : ''}</span>
                        </div>
                    </td>
                    <td>৳ ${product.price}</td>
                    <td>
                        <button class="remove-btn" onclick="removeFromCart(${product.id})">&times;</button>
                    </td>
                </tr>
            `;
        }
    });

    if (totalPriceElement) {
        totalPriceElement.innerText = `৳ ${grandTotal}`;
    }
}

// পেজ লোড হলেই কার্ট এবং কাউন্টার রানিং করার জন্য
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
});
let totalOrderPrice = 0;

// চেকাউট পেজে অর্ডারের সঠিক আইটেম এবং ৪৯৯ টাকার হিসাব দেখানোর ফাংশন
function displayCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-summary-items');
    const totalElement = document.getElementById('checkout-total-price');
    const walletDisplay = document.getElementById('wallet-balance');

    if (!summaryContainer) return; // চেকাউট পেজে না থাকলে কাজ করবে না

    summaryContainer.innerHTML = "";
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    totalOrderPrice = 0;

    if (cartItems.length === 0) {
        summaryContainer.innerHTML = '<p style="color:rgba(255,255,255,0.4);">No items in cart.</p>';
        if (totalElement) totalElement.innerText = '৳ ০';
        return;
    }

    cartItems.forEach(item => {
        // product.js এর products অ্যারে থেকে মিলিয়ে দেখা
        const product = products.find(p => p.id === item.id);

        if (product) {
            let itemTotal = product.price * item.quantity;
            totalOrderPrice += itemTotal;

            summaryContainer.innerHTML += `
                <div class="summary-item">
                    <span>${product.name} (x${item.quantity})</span>
                    <span>৳ ${itemTotal.toLocaleString()}</span>
                </div>
            `;
        }
    });

    if (totalElement) totalElement.innerText = `৳ ${totalOrderPrice.toLocaleString()}`;

    // ওয়ালেট ব্যালেন্স শো করানো (লোকাল স্টোরেজ থেকে)
    if (walletDisplay) {
        let currentBal = parseFloat(localStorage.getItem('skysion_wallet')) || 0;
        walletDisplay.innerText = `৳ ${currentBal.toLocaleString()}`;
    }
}

// অর্ডার প্লেস ফর্ম সাবমিশন হ্যান্ডেলার
const checkoutForm = document.getElementById('checkout-submit-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const method = document.getElementById('payment-method').value;
        let currentBal = parseFloat(localStorage.getItem('skysion_wallet')) || 0;

        if (method === 'wallet') {
            if (currentBal >= totalOrderPrice) {
                // ওয়ালেট থেকে টাকা মাইনাস করা
                localStorage.setItem('skysion_wallet', (currentBal - totalOrderPrice).toString());
                alert('🎉 Congratulations! Payment successful via Skysion Wallet. Your order has been placed.');
                localStorage.removeItem('cart'); // কার্ট ক্লিয়ার করা
                window.location.href = 'index.html';
            } else {
                alert('❌ Insufficient Wallet Balance! Please top up your wallet from Account Page.');
            }
        } else {
            alert('Order placed via Cash on Delivery!');
            localStorage.removeItem('cart'); // কার্ট ক্লিয়ার করা
            window.location.href = 'index.html';
        }
    });
}

// আগের DOMContentLoaded লিসেনারের ভেতরে রান করানোর জন্য
document.addEventListener("DOMContentLoaded", displayCheckoutSummary);