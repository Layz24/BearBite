let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

const menuItems = [
  { id: 1, name: 'Burger', price: 8.99, image: 'images/Burger.jpg' },
  { id: 2, name: 'Chinese Food', price: 10.99, image: 'images/Chinese_food.jpg' },
  { id: 3, name: 'Fried Basket', price: 12.99, image: 'images/Fried_basket.jpg' },
  { id: 4, name: 'Fried Chicken', price: 9.99, image: 'images/Fried_chicken.jpg' },
  { id: 5, name: 'Ice Cream', price: 5.99, image: 'images/Ice_cream.jpg' },
  { id: 6, name: 'Jerk Chicken', price: 13.99, image: 'images/Jerk_chicken.jpg' },
  { id: 7, name: 'Nachos', price: 6.99, image: 'images/Nachos.jpg' },
  { id: 8, name: 'Pizza', price: 11.99, image: 'images/Pizza.jpg' },
  { id: 9, name: 'Salad', price: 6.99, image: 'images/Salad.jpg' },
  { id: 10, name: 'Sushi', price: 15.99, image: 'images/sushi.jpg' }
];

function renderMenu() {
  const menuGrid = document.getElementById('menuGrid');
  menuGrid.innerHTML = '';
  menuItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p>${item.name} - $${item.price.toFixed(2)}</p>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    menuGrid.appendChild(card);
  });
}

function addToCart(id) {
  const item = menuItems.find(item => item.id === id);
  const existingItem = cart.find(cartItem => cartItem.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${item.name} added to cart!`);
}

function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    alert('Login successful! Redirecting to the home page.');
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password.');
  }
}

function signup() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  if (!username || !password) {
    alert('Please fill in all fields.');
    return;
  }

  const userExists = users.some(u => u.username === username);

  if (userExists) {
    alert('Username already taken. Please choose another.');
  } else {
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! You can now log in.');
  }
}

function displayCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const totalAmountDiv = document.getElementById('totalAmount');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <p>${item.name} - $${item.price.toFixed(2)} x 
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
      </p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  totalAmountDiv.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

function updateQuantity(index, newQuantity) {
  if (newQuantity < 1) return;

  cart[index].quantity = parseInt(newQuantity);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function showPopUp() {
  document.getElementById('popup').style.display = 'block';
}

function closePopUp() {
  document.getElementById('popup').style.display = 'none';
}

function searchMenu() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const foodCards = document.querySelectorAll('.food-card');

  foodCards.forEach(card => {
    const itemName = card.querySelector('p').textContent.toLowerCase();
    card.style.display = itemName.includes(query) ? '' : 'none';
  });
}

if (window.location.pathname.includes('order.html')) renderMenu();
if (window.location.pathname.includes('checkout.html')) displayCart();
