let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let mockData = [];

function loadMockData(callback) {
  fetch('http://127.0.0.1:5000/mock_data.json')
    .then(response => response.json())
    .then(data => {
      mockData = data;
      console.log('Mock data loaded:', mockData);
      callback();
    })
    .catch(error => console.error('Error loading mock data:', error));
}

function renderMenu() {
  fetch('http://127.0.0.1:5000/api/menu')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch menu items.');
      }
      return response.json();
    })
    .then(menuItems => {
      const menuGrid = document.getElementById('menuGrid');
      menuGrid.innerHTML = '';

      if (menuItems.length === 0) {
        menuGrid.innerHTML = '<p>No items available.</p>';
        return;
      }

      menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card';
        const price = Number(item.price) || 0;

        card.innerHTML = `
          <img src="${item.image_url}" alt="${item.name}">
          <p>${item.name} - $${price.toFixed(2)}</p>
          <button onclick="addToCart(${item.item_id})">Add to Cart</button>
        `;
        menuGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching menu:', error);
      document.getElementById('menuGrid').innerHTML = `<p>Error loading menu: ${error.message}</p>`;
    });
}

function addToCart(itemId) {
  const item = cart.find(i => i.item_id === itemId);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ item_id: itemId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Item added to cart!');
}

function renderCart() {
  console.log('Rendering cart...');
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  console.log('Cart items:', cartItems);

  const cartContainer = document.getElementById('cartItems');
  const totalAmount = document.getElementById('totalAmount');
  cartContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    totalAmount.innerText = '';
    return;
  }

  let total = 0;
  cartItems.forEach(item => {
    const itemData = mockData.find(data => data.item_id === item.item_id) || {};
    const price = item.quantity * (itemData.price || 0);
    total += price;

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <span>${itemData.name || 'Unknown Item'} - $${(itemData.price || 0).toFixed(2)} x ${item.quantity}</span>
      <button onclick="removeFromCart(${item.item_id})">Remove</button>
    `;
    cartContainer.appendChild(itemRow);
  });

  totalAmount.innerText = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.item_id !== itemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function placeOrder() {
  const confirmationPopup = document.createElement('div');
  confirmationPopup.className = 'popup';
  confirmationPopup.innerHTML = `
    <div class="popup-content">
      <span class="close" onclick="closePopup()">×</span>
      <img src="images/Food_Delivery.gif" alt="Order Confirmed" class="popup-gif">
      <p>A dasher has been assigned!</p>
    </div>
  `;
  document.body.appendChild(confirmationPopup);
  confirmationPopup.style.display = 'block';

  const orderData = {
    cart: cart,
    total: cart.reduce((sum, item) => {
      const itemData = mockData.find(data => data.item_id === item.item_id) || {};
      return sum + (itemData.price || 0) * item.quantity;
    }, 0)
  };

  fetch('http://127.0.0.1:5000/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Order placed successfully:', data);
      } else {
        console.error('Order failed:', data.message);
      }
    })
    .catch(error => console.error('Error placing order:', error));

  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
}

function closePopup() {
  document.querySelector('.popup').remove();
}

function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  fetch('http://127.0.0.1:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Login successful!');
        window.location.href = 'http://127.0.0.1:5000/order.html';
      } else {
        alert('Invalid username or password.');
      }
    })
    .catch(error => console.error('Error logging in:', error));
}

function signup() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  fetch('http://127.0.0.1:5000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Signup successful!');
      } else {
        alert('Signup failed: ' + data.message);
      }
    })
    .catch(error => console.error('Error during signup:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  const cartPage = document.getElementById('cartItems');
  if (cartPage) {
    console.log('Cart page detected. Loading mock data...');
    loadMockData(renderCart);
  } else {
    console.log('Menu page detected. Rendering menu...');
    renderMenu();
  }
});
