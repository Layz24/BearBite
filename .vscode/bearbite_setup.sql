SET SQL_SAFE_UPDATES = 0;

DROP DATABASE IF EXISTS bearbite;
CREATE DATABASE IF NOT EXISTS bearbite;
USE bearbite;

CREATE TABLE IF NOT EXISTS Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Food_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    restaurant_id INT,
    genre_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id),
    FOREIGN KEY (genre_id) REFERENCES Genres(id)
);

CREATE TABLE IF NOT EXISTS Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    restaurant_id INT,
    foodItem VARCHAR(255),
    quantity INT,
    totalAmount DECIMAL(10, 2),
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id)
);

CREATE TABLE IF NOT EXISTS Order_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    food_item_id INT,
    quantity INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(orderID),
    FOREIGN KEY (food_item_id) REFERENCES Food_Items(id)
);

INSERT INTO Customers (name, email, phone) VALUES
('John Doe', 'john@example.com', '123-456-7890'),
('Jane Smith', 'jane@example.com', '987-654-3210'),
('Alice Johnson', 'alice@example.com', '456-789-0123');

INSERT INTO Restaurants (name, location, phone) VALUES
('Pasta Palace', '123 Pasta St.', '555-0123'),
('Burger Haven', '456 Burger Blvd.', '555-4567'),
('Sushi World', '789 Sushi Ave.', '555-7890');

INSERT INTO Genres (name) VALUES
('Italian'),
('American'),
('Japanese');

INSERT INTO Food_Items (name, description, price, restaurant_id, genre_id) VALUES
('Spaghetti Carbonara', 'Classic Italian pasta dish', 12.99, 1, 1),
('Cheeseburger', 'Juicy beef burger with cheese', 9.99, 2, 2),
('California Roll', 'Sushi roll with crab and avocado', 8.99, 3, 3);