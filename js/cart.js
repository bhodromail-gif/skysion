<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="icon" type="image/jpeg" href="images/img/logo/logo.jpeg">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Orders - SKYSION</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <style>
    .orders-container { padding: 150px 6% 80px 6%; max-width: 900px; margin: 0 auto; }
    .orders-container h2 { font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 30px; }
    .order-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 25px; margin-bottom: 20px; }
    .order-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 15px; margin-bottom: 15px; }
    .status-badge { background: #ffa502; color: #000; padding: 3px 10px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .order-item-row { font-size: 14px; color: rgba(255, 255, 255, 0.8); margin-bottom: 10px; }
    .order-total-row { display: flex; justify-content: space-between; font-weight: 600; margin-top: 15px; padding-top: 15px; border-top: 1px dashed rgba(255, 255, 255, 0.1); }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="logo"><a href="index.html"><img src="images/img/logo/logo.jpeg" alt="SKYSION LOGO" width="120" height="40"></a></div>
    <nav>
      <ul class="nav-links">
        <li><a href="index.html">HOME</a></li>
        <li><a href="shop.html">SHOP</a></li>
        <li><a href="account.html">ACCOUNT</a></li>
      </ul>
    </nav>
    <div class="nav-icons"><a href="cart.html">CART (<span id="cart-count">0</span>)</a></div>
  </header>

  <main class="orders-container">
    <h2>My Orders</h2>
    <div id="my-orders-list">Loading orders...</div>
  </main>

  <script>
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNnaYNC-Nl-R1jfb_VZUpXfnOqZ4zFetryclJG_vc0zHarou8ofRzjd0VU7F1cUiVu/exec';
    const ordersListContainer = document.getElementById('my-orders-list');

    async function loadOrders() {
      try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        if (!data || data.length <= 1) {
          ordersListContainer.innerHTML = "<p>No orders found.</p>";
          return;
        }

        ordersListContainer.innerHTML = "";
        data.slice(1).reverse().forEach((row) => {
          // এখানে row[9] এ আছে আইটেম লিস্ট (সাইজসহ)
          // আপনার রিকোয়ারমেন্ট অনুযায়ী আমরা শুধু প্রোডাক্টের মূল নামটি দেখাবো (চাইলে সাইজও রাখতে পারেন)
          const itemsRaw = row[9] || 'N/A';
          const status = row[10] || 'Pending';

          ordersListContainer.innerHTML += `
            <div class="order-card">
              <div class="order-header">
                <div><strong>Order ID: ${row[0]}</strong><p style="font-size:12px; margin:0;">Date: ${row[1]}</p></div>
                <div><span class="status-badge">${status}</span></div>
              </div>
              <div class="order-item-row"><strong>Items:</strong> ${itemsRaw}</div>
              <div class="order-total-row"><span>Method: ${row[6]}</span><span style="color:#d12e43;">Total: ৳ ${row[5]}</span></div>
            </div>
          `;
        });
      } catch (error) {
        ordersListContainer.innerHTML = "<p>Failed to load orders.</p>";
      }
    }
    document.addEventListener("DOMContentLoaded", loadOrders);
  </script>
</body>
</html>