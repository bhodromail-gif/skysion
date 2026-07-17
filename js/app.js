// 🌟 ফায়ারবেস SDK এবং ফায়ারস্টোর লোড ও কনফিগারেশন
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// তোমার রিয়েল ফায়ারবেস কনফিগারেশন 👇
const firebaseConfig = {
    apiKey: "AIzaSyDWljpSviJczy_4v6OmAPXCF34eQXv95CA",
    authDomain: "skysion-shop.firebaseapp.com",
    projectId: "skysion-shop",
    storageBucket: "skysion-shop.firebasestorage.app",
    messagingSenderId: "849058892138",
    appId: "1:849058892138:web:7ee33dfd8619d0e5ebfd13",
    measurementId: "G-Q6832B2YQ9"
};

// ফায়ারবেস ও ফায়ারস্টোর ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// লোকাল স্টোরেজ থেকে কার্টের ডাটা গেট করা
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ১. কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("Product not found!");
        return;
    }

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
    
    if (document.getElementById('cart-items-body')) {
        displayCart();
    }
}

// ২. কার্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
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
    
    if (!cartBody) return;

    cartBody.innerHTML = "";
    let grandTotal = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:rgba(255,255,255,0.4); padding: 40px 0;">Your cart is empty.</td></tr>`;
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

    if (!summaryContainer) return;

    summaryContainer.innerHTML = "";
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    totalOrderPrice = 0;

    if (cartItems.length === 0) {
        summaryContainer.innerHTML = '<p style="color:rgba(255,255,255,0.4);">No items in cart.</p>';
        if (totalElement) totalElement.innerText = '৳ ০';
        return;
    }

    cartItems.forEach(item => {
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

    if (walletDisplay) {
        let currentBal = parseFloat(localStorage.getItem('skysion_wallet')) || 0;
        walletDisplay.innerText = `৳ ${currentBal.toLocaleString()}`;
    }
}

// ৫. অর্ডার প্লেস মেথড (Firebase Firestore রিয়েল-টাইম ডাটাবেজ ইন্টিগ্রেশন)
async function placeOrder(method) {
    let currentBal = parseFloat(localStorage.getItem('skysion_wallet')) || 0;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        alert('❌ Your cart is empty!');
        return;
    }

    if (method === 'wallet' && currentBal < totalOrderPrice) {
        alert('❌ Insufficient Wallet Balance!');
        return;
    }

    const orderId = "SK-" + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('bn-BD');

    const firebaseOrderData = {
        orderId: orderId,
        date: orderDate,
        totalPrice: totalOrderPrice,
        paymentMethod: method === 'wallet' ? 'Skysion Wallet' : 'Cash on Delivery',
        status: 'Pending',
        items: cartItems.map(item => {
            const product = products.find(p => p.id === item.id);
            return {
                name: product ? product.name : 'Unknown Product',
                quantity: item.quantity,
                price: product ? product.price : 0
            };
        })
    };

    try {
        // 🚀 ফায়ারস্টোরের 'orders' কালেকশনে ডেটা পাঠানো হচ্ছে
        await addDoc(collection(db, "orders"), firebaseOrderData);

        // কাস্টমারের ব্রাউজারে হিস্ট্রি সেভ করা
        let myOrders = JSON.parse(localStorage.getItem('my_orders')) || [];
        myOrders.unshift({
            orderId: orderId,
            date: orderDate,
            total: totalOrderPrice,
            payment: firebaseOrderData.paymentMethod,
            status: 'Pending',
            items: firebaseOrderData.items
        });
        localStorage.setItem('my_orders', JSON.stringify(myOrders));

        if (method === 'wallet') {
            localStorage.setItem('skysion_wallet', (currentBal - totalOrderPrice).toString());
        }

        alert('🎉 Order placed successfully and saved to Firebase!');
        localStorage.removeItem('cart');
        window.location.href = 'orders.html';

    } catch (error) {
        console.error("Firebase Error: ", error);
        alert('❌ Firebase Database Connection error! Please try again.');
    }
}

// গ্লোবাল ফাংশন বাইন্ডিং (যাতে HTML বাটন ক্লিকের onclick খুঁজে পায়)
window.placeOrder = placeOrder;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

document.addEventListener("DOMContentLoaded", displayCheckoutSummary);