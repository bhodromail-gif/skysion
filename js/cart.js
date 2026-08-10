// লোকাল স্টোরেজ থেকে কার্টের ডাটা গেট করা
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ১. সিলেক্ট করা সাইজসহ কার্টে প্রোডাক্ট অ্যাড করার ফাংশন
function addToCartWithSelectedSize(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // ইউজার যে সাইজটি সিলেক্ট করেছে তা ড্রপডাউন থেকে নেওয়া
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect ? sizeSelect.value : "M";

    // একই প্রোডাক্ট ভিন্ন সাইজের হতে পারে, তাই id এবং size মিলিয়ে চেক করা হচ্ছে
    const cartItem = cart.find(item => item.id === productId && item.size === selectedSize);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id: product.id, size: selectedSize, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} (${selectedSize}) কার্টে যোগ করা হয়েছে!`);
    if (document.getElementById('cart-items-body')) displayCart();
}

// পুরোনো addToCart ফাংশনকে নতুনটির সাথে কানেক্ট রাখা হলো
function addToCart(productId) {
    addToCartWithSelectedSize(productId);
}

// ২. কার্ট থেকে প্রোডাক্ট রিমুভ করার ফাংশন (আইডি এবং সাইজ মিলিয়ে রিমুভ করবে)
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
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

// ৪. কার্ট পেজ রেন্ডার (এখানে সাইজ সহ দেখানো হবে)
function displayCart() {
    const cartBody = document.getElementById('cart-items-body');
    const totalPriceElement = document.getElementById('cart-total-price');
    if (!cartBody) return;

    cartBody.innerHTML = "";
    let grandTotal = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 30px;">Your cart is empty.</td></tr>`;
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
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${product.image}" width="50" loading="lazy" alt="${product.name}"> 
                            <div>
                                <span>${product.name}</span><br>
                                <small style="color: #d12e43;">Size: ${item.size || 'M'} | Qty: ${item.quantity}</small>
                            </div>
                        </div>
                    </td>
                    <td>৳ ${itemTotal}</td>
                    <td><button class="remove-btn" onclick="removeFromCart(${product.id}, '${item.size}')">&times;</button></td>
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
            let itemTotal = product.price * item.quantity;
            totalOrderPrice += itemTotal;
            summaryContainer.innerHTML += `
                <div class="summary-item">
                    <span>${product.name} (${item.size}) x${item.quantity}</span> 
                    <span>৳ ${itemTotal}</span>
                </div>`;
        }
    });
    if (totalElement) totalElement.innerText = `৳ ${totalOrderPrice}`;
}

// ৬. অর্ডার প্লেস (গুগল শিট কানেক্টেড)
async function placeOrder(method) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) { alert('Cart is empty!'); return; }

    const orderData = {
        orderId: "SK-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('bn-BD'),
        customerName: document.getElementById('name')?.value || "",
        phone: document.getElementById('phone')?.value || "",
        address: document.getElementById('address')?.value || "",
        totalPrice: totalOrderPrice,
        paymentMethod: method,
        senderNumber: document.getElementById('senderNumber')?.value || "N/A",
        transactionId: document.getElementById('transactionId')?.value || "N/A",
        // গুগল শিটে নাম এবং সাইজ দুটোই সুন্দরভাবে সেভ হবে
        items: cartItems.map(i => {
            const product = products.find(p => p.id === i.id);
            return `${product ? product.name : 'Unknown'} [Size: ${i.size}] (x${i.quantity})`;
        }).join(", ")
    };

    try {
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
        alert('Error placing order. Please try again.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
    displayCheckoutSummary();
});