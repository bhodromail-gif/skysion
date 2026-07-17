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
        cartItem.quantity += 1; // থাকলে পরিমাণ বাড়ানো
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    // লোকাল স্টোরেজে সেভ এবং নেভিগেশন কাউন্টার আপডেট
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
    
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

// ४. কার্ট পেজে প্রোডাক্টের টেবিল ও টোটাল প্রাইস রেন্ডার করার ফাংশন
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

// চেকাউট পেজে অর্ডারের সঠিক আইটেম এবং হিসাব দেখানোর ফাংশন
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

    // ওয়ালেট ব্যালেন্স শো করানো (লোকাল স্টোরেজ থেকে)
    if (walletDisplay) {
        let currentBal = parseFloat(localStorage.getItem('skysion_wallet')) || 0;
        walletDisplay.innerText = `৳ ${currentBal.toLocaleString()}`;
    }
}

// ৫. অর্ডার প্লেস মেথড (লোকাল স্টোরেজে ট্র্যাকিং ড্যাশবোর্ড ডাটা সেভ)
function placeOrder(method) {
    let currentBal = parseFloat(localStorage.getItem('skysion_wallet')) || 0;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // কার্ট খালি থাকলে অর্ডার আটকানো
    if (cartItems.length === 0) {
        alert('❌ Your cart is empty!');
        return;
    }

    // নতুন অর্ডারের ডাটা অবজেক্ট তৈরি
    const newOrder = {
        orderId: "SK-" + Math.floor(100000 + Math.random() * 900000), // ইউনিক অর্ডার আইডি জেনারেট
        date: new Date().toLocaleDateString('bn-BD'), // অর্ডার সাবমিটের তারিখ
        total: totalOrderPrice,
        payment: method === 'wallet' ? 'Skysion Wallet' : 'Cash on Delivery',
        status: 'Pending', // ডিফল্ট স্ট্যাটাস পেন্ডিং থাকবে
        items: cartItems.map(item => {
            const product = products.find(p => p.id === item.id);
            return {
                name: product ? product.name : 'Unknown Product',
                quantity: item.quantity,
                price: product ? product.price : 0
            };
        })
    };

    // লোকাল স্টোরেজে আগের অর্ডারের সাথে নতুনটি যোগ করা
    let myOrders = JSON.parse(localStorage.getItem('my_orders')) || [];
    myOrders.unshift(newOrder); // লেটেস্ট অর্ডার ওপরে রাখার জন্য

    if (method === 'wallet') {
        if (currentBal >= totalOrderPrice) {
            // ওয়ালেট থেকে ব্যালেন্স কেটে নেওয়া
            localStorage.setItem('skysion_wallet', (currentBal - totalOrderPrice).toString());
            localStorage.setItem('my_orders', JSON.stringify(myOrders));
            
            alert('🎉 Congratulations! Payment successful via Skysion Wallet. Your order has been placed.');
            localStorage.removeItem('cart'); // কার্ট খালি করা
            window.location.href = 'orders.html'; // সরাসরি কাস্টমারের অর্ডার ড্যাশবোর্ডে পাঠাবে
        } else {
            alert('❌ Insufficient Wallet Balance! Please top up your wallet from Account Page.');
        }
    } else {
        localStorage.setItem('my_orders', JSON.stringify(myOrders));
        
        alert('🎉 Order placed successfully via Cash on Delivery!');
        localStorage.removeItem('cart'); // কার্ট খালি করা
        window.location.href = 'orders.html'; // সরাসরি কাস্টমারের অর্ডার ড্যাশবোর্ডে পাঠাবে
    }
}

// আগের DOMContentLoaded লিসেনারের ভেতরে রান করানোর জন্য
document.addEventListener("DOMContentLoaded", displayCheckoutSummary);