// লোকাল স্টোরেজ থেকে কার্টের ডাটা রিড করা
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ১. নির্দিষ্ট সাইজসহ কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToCartWithSelectedSize(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect ? sizeSelect.value : "M";

    // একই প্রোডাক্ট ভিন্ন সাইজের হলে আলাদা আইটেম হিসেবে গণ্য হবে
    const cartItem = cart.find(item => item.id === productId && item.size === selectedSize);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id: product.id, size: selectedSize, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Success: ${product.name} (Size: ${selectedSize}) added to cart!`);
    
    if (document.getElementById('cart-items-body')) {
        displayCart();
    }
}

// পুরোনো addToCart ফাংশনকে নতুনটির সাথে যুক্ত রাখা হলো
function addToCart(productId) {
    addToCartWithSelectedSize(productId);
}

// ২. কার্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ৩. নেভিগেশন বারে কার্টের কাউন্ট আপডেট করা
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalItems;
    }
}

// ৪. কার্ট পেজ রেন্ডার করা
function displayCart() {
    const cartBody = document.getElementById('cart-items-body');
    const totalPriceElement = document.getElementById('cart-total-price');
    if (!cartBody) return;

    cartBody.innerHTML = "";
    let grandTotal = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 40px; color: #aaa;">Your cart is empty.</td></tr>`;
        if (totalPriceElement) totalPriceElement.innerText = "৳ ০";
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            let itemTotal = product.price * item.quantity;
            grandTotal += itemTotal;
            cartBody.innerHTML += `
                <tr>
                    <td style="padding: 15px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <img src="${product.image}" width="60" height="60" style="object-fit:cover; border-radius:4px;" alt="${product.name}"> 
                            <div>
                                <span style="font-weight: bold; color: #fff;">${product.name}</span><br>
                                <small style="color: #ff4d4d; font-weight: 600;">Size: ${item.size || 'M'} | Qty: ${item.quantity}</small>
                            </div>
                        </div>
                    </td>
                    <td style="color: #fff;">৳ ${itemTotal}</td>
                    <td><button onclick="removeFromCart(${product.id}, '${item.size}')" style="background: #ff4d4d; color: #fff; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">&times;</button></td>
                </tr>`;
        }
    });
    if (totalPriceElement) totalPriceElement.innerText = `৳ ${grandTotal}`;
}

// ৫. চেকাউট সামারি তৈরি করা
let totalOrderPrice = 0;
function displayCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-summary-items');
    const totalElement = document.getElementById('checkout-total-price');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = "";
    totalOrderPrice = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            let itemTotal = product.price * item.quantity;
            totalOrderPrice += itemTotal;
            summaryContainer.innerHTML += `
                <div class="summary-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #ccc;">
                    <span>${product.name} (Size: ${item.size}) x${item.quantity}</span> 
                    <span>৳ ${itemTotal}</span>
                </div>`;
        }
    });
    if (totalElement) totalElement.innerText = `৳ ${totalOrderPrice}`;
}

// ৬. গুগল শিটে অর্ডার প্লেস করার মূল ফাংশন (সাইজসহ)
async function placeOrder(method) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) { 
        alert('Your cart is empty!'); 
        return; 
    }

    const orderData = {
        orderId: "SK-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('bn-BD') + " " + new Date().toLocaleTimeString(),
        customerName: document.getElementById('name')?.value || "Guest",
        phone: document.getElementById('phone')?.value || "N/A",
        address: document.getElementById('address')?.value || "N/A",
        totalPrice: totalOrderPrice,
        paymentMethod: method,
        senderNumber: document.getElementById('senderNumber')?.value || "N/A",
        transactionId: document.getElementById('transactionId')?.value || "N/A",
        // এখানে খুব স্পষ্টভাবে সাইজ যুক্ত করে দেওয়া হয়েছে যা গুগল শিটে ও অর্ডার পেজে শো করবে
        items: cartItems.map(i => {
            const product = products.find(p => p.id === i.id);
            return `${product ? product.name : 'Unknown Product'} [Size: ${i.size}] (Qty: ${i.quantity})`;
        }).join(" | ")
    };

    try {
        // আপনার গুগল অ্যাপস স্ক্রিপ্টের ওয়েব অ্যাপ ইউআরএল এখানে বসানো আছে
        await fetch('https://script.google.com/macros/s/AKfycbwNnaYNC-Nl-R1jfb_VZUpXfnOqZ4zFetryclJG_vc0zHarou8ofRzjd0VU7F1cUiVu/exec', {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(orderData)
        });
        
        alert('🎉 Order placed successfully!');
        
        let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
        myOrders.unshift(orderData);
        localStorage.setItem('myOrders', JSON.stringify(myOrders));

        localStorage.removeItem('cart');
        window.location.href = 'orders.html';
    } catch (error) {
        console.error("Order Error:", error);
        alert('Error placing order. Please try again.');
    }
}

// পেজ লোড হওয়ার সাথে সাথে ফাংশনগুলো কল করা
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
    displayCheckoutSummary();
});