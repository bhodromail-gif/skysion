// লোকাল স্টোরেজ থেকে কার্টের ডাটা গেট করা
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ১. কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
    if (document.getElementById('cart-items-body')) displayCart();
}

// ২. কার্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ৩. নেভিগেশন বারে কার্টের কাউন্ট আপডেট
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalItems;
    }
}

// ৪. কার্ট পেজ রেন্ডার
function displayCart() {
    const cartBody = document.getElementById('cart-items-body');
    const totalPriceElement = document.getElementById('cart-total-price');
    if (!cartBody) return;

    cartBody.innerHTML = "";
    let grandTotal = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Your cart is empty.</td></tr>`;
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
                    <td><img src="${product.image}" width="50"> ${product.name} x ${item.quantity}</td>
                    <td>৳ ${product.price}</td>
                    <td><button class="remove-btn" onclick="removeFromCart(${product.id})">&times;</button></td>
                </tr>`;
        }
    });
    if (totalPriceElement) totalPriceElement.innerText = `৳ ${grandTotal}`;
}

// ৫. চেকাউট সামারি
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
            totalOrderPrice += product.price * item.quantity;
            summaryContainer.innerHTML += `<div class="summary-item"><span>${product.name} (x${item.quantity})</span> <span>৳ ${product.price * item.quantity}</span></div>`;
        }
    });
    if (totalElement) totalElement.innerText = `৳ ${totalOrderPrice}`;
}

// ৬. অর্ডার প্লেস (গুগল শিট কানেক্টেড)
async function placeOrder(method) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) { alert('Cart is empty!'); return; }

    // ইউজার থেকে ইনপুট ফিল্ডের ডাটা নেওয়া (আপনার ফর্মের আইডি অনুযায়ী)
    const orderData = {
        orderId: "SK-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('bn-BD'),
        customerName: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        totalPrice: totalOrderPrice,
        paymentMethod: method,
        senderNumber: document.getElementById('senderNumber')?.value || "N/A",
        transactionId: document.getElementById('transactionId')?.value || "N/A",
        items: cartItems.map(i => products.find(p => p.id === i.id).name + " (x" + i.quantity + ")").join(", ")
    };

    // গুগল শিটে পাঠানোর চেষ্টা
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwNnaYNC-Nl-R1jfb_VZUpXfnOqZ4zFetryclJG_vc0zHarou8ofRzjd0VU7F1cUiVu/exec', {
            method: 'POST',
            mode: 'no-cors', // এটি ক্রস-অরিজিন এরর এড়াতে সাহায্য করবে
            body: JSON.stringify(orderData)
        });
        
        alert('🎉 Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'orders.html';
    } catch (error) {
        alert('Error placing order. Please try again.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
    displayCheckoutSummary();
});