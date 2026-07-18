<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Orders - SKYSION</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <style>
    .orders-container { padding: 150px 6% 80px 6%; max-width: 900px; margin: 0 auto; }
    .orders-container h2 { font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 30px; letter-spacing: 1px; }
    .order-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 25px; margin-bottom: 20px; }
    .order-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 15px; margin-bottom: 15px; }
    .status-badge { background: #ffa502; color: #000; padding: 3px 10px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .order-item-row { display: flex; justify-content: space-between; font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 8px; }
    .order-total-row { display: flex; justify-content: space-between; font-weight: 600; margin-top: 15px; padding-top: 15px; border-top: 1px dashed rgba(255, 255, 255, 0.1); }
  </style>
</head>

<body>
  <header class="navbar">
    <div class="logo"><a href="index.html"><img src="images/img/logo/logo.jpeg" alt="SKYSION LOGO" id="nav-logo"></a></div>
    <nav>
      <ul class="nav-links">
        <li><a href="index.html">HOME</a></li>
        <li><a href="shop.html">SHOP</a></li>
        <li><a href="wishlist.html">WISHLIST</a></li>
        <li><a href="account.html">ACCOUNT</a></li>
      </ul>
    </nav>
    <div class="nav-icons"><a href="cart.html">CART (<span id="cart-count">0</span>)</a></div>
  </header>

  <main class="orders-container">
    <h2>My Orders</h2>
    <div id="my-orders-list"></div>
  </main>

  <script src="js/product.js"></script>
  <script src="js/cart.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const ordersListContainer = document.getElementById('my-orders-list');
      // 'my_orders' এর বদলে 'myOrders' ব্যবহার করা হয়েছে যা app.js এ সেভ হয়
      let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];

      if (myOrders.length === 0) {
        ordersListContainer.innerHTML = `<p style="color: rgba(255,255,255,0.4); text-align: center; padding: 50px 0;">You haven't placed any orders yet.</p>`;
        return;
      }

      ordersListContainer.innerHTML = "";
      myOrders.forEach(order => {
        // items এখন একটি স্ট্রিং, তাই সরাসরি বসানো হয়েছে
        ordersListContainer.innerHTML += `
          <div class="order-card">
            <div class="order-header">
              <div>
                <strong style="color: #fff;">Order ID: ${order.orderId}</strong>
                <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 5px 0 0 0;">Date: ${order.date}</p>
              </div>
              <div><span class="status-badge">Pending</span></div>
            </div>
            <div class="order-items-list">
               <div class="order-item-row"><span>Items: ${order.items}</span></div>
            </div>
            <div class="order-total-row">
              <span>Method: ${order.paymentMethod}</span>
              <span style="color: #d12e43; font-size: 16px;">Total: ৳ ${order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        `;
      });
    });
  </script>
</body>
</html>