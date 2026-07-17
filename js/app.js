// Order placement and localStorage handling (Google Sheets Integrated)

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ১. কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) { console.error("Product not found!"); return; }
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) { cartItem.quantity += 1; } 
    else { cart.push({ id: product.id, quantity: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} কার্টে যোগ করা হয়েছে!`);
    if (document.getElementById('cart-items-body')) { displayCart(); }
}

// ২. কার্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ৩. কার্ট সংখ্যা আপডেট
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
        cartBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 40px 0;">Your cart is empty.</td></tr>`;
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
                    <td><div class="cart-product-info"><img src="${product.image}" alt="${product.name}"><span>${product.name} ${item.quantity > 1 ? `x ${item.quantity}` : ''}</span></div></td>
                    <td>৳ ${product.price}</td>
                    <td><button class="remove-btn" onclick="removeFromCart(${product.id})">&times;</button></td>
                </tr>`;
        }
    });
    if (totalPriceElement) totalPriceElement.innerText = `৳ ${grandTotal}`;
}

let totalOrderPrice = 0;

// চেকাউট পেজ সামারি
function displayCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-summary-items');
    const totalElement = document.getElementById('checkout-total-price');
    if (!summaryContainer) return;
    summaryContainer.innerHTML = "";
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    totalOrderPrice = 0;
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            totalOrderPrice += (product.price * item.quantity);
            summaryContainer.innerHTML += `<div class="summary-item"><span>${product.name} (x${item.quantity})</span><span>৳ ${(product.price * item.quantity).toLocaleString()}</span></div>`;
        }
    });
    if (totalElement) totalElement.innerText = `৳ ${totalOrderPrice.toLocaleString()}`;
}

// ৫. ফাইনাল অর্ডার প্লেস (Google Sheets)
async function placeOrder(method) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) { alert('❌ Your cart is empty!'); return; }

    const firstName = document.getElementById('cust-first-name')?.value || "";
    const customerPhone = document.getElementById('cust-phone')?.value || "";
    const customerAddress = document.getElementById('cust-address')?.value || "";

    const orderId = "SK-" + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
        orderId: orderId,
        date: new Date().toLocaleDateString(),
        customerName: firstName,
        phone: customerPhone,
        address: customerAddress,
        totalPrice: totalOrderPrice,
        paymentMethod: method,
        items: cartItems.map(item => {
            const product = products.find(p => p.id === item.id);
            return `${product ? product.name : 'Unknown'} (x${item.quantity})`;
        }).join(", ")
    };

    try {
        await fetch("https://script.google.com/macros/s/AKfycbzo59yoK8Xh8wEvIk2RL4Bz2uO2_ZOoE-Z6Dwp-vj26OcAm3m4XtNpLsfydifN0LDrt/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });
        alert('🎉 অর্ডার সফল হয়েছে!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    } catch (error) {
        alert("সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
}

window.placeOrder = placeOrder;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
    displayCheckoutSummary();
});