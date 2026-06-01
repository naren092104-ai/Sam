CREATE DATABASE IF NOT EXISTS admin_panel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE admin_panel;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  phone VARCHAR(32),
  status ENUM('active','inactive','blocked') NOT NULL DEFAULT 'active',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(511),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  category_id INT,
  stock INT NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  offer_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('draft','published','out_of_stock') NOT NULL DEFAULT 'draft',
  image VARCHAR(511),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  path VARCHAR(511) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  full_name VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255) NULL,
  area VARCHAR(128) NULL,
  city VARCHAR(128) NOT NULL,
  district VARCHAR(128) NULL,
  state VARCHAR(128) NOT NULL,
  pincode VARCHAR(32) NOT NULL,
  country VARCHAR(128) NOT NULL DEFAULT 'India',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS delivery_agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NULL,
  email VARCHAR(256) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT NULL,
  delivery_agent_id INT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('Pending','Confirmed','Processing','Packed','Shipped','Out For Delivery','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  payment_id INT,
  tracking_id VARCHAR(255),
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (delivery_agent_id) REFERENCES delivery_agents(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_code VARCHAR(64) NULL,
  category_name VARCHAR(128) NULL,
  product_name VARCHAR(255) NULL,
  quantity INT NOT NULL DEFAULT 1,
  weight DECIMAL(10,2) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status ENUM('Pending','Confirmed','Processing','Packed','Shipped','Out For Delivery','Delivered','Cancelled') NOT NULL,
  note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  method ENUM('Razorpay','Stripe','UPI','COD') NOT NULL DEFAULT 'COD',
  status ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  refund_status ENUM('none','requested','processed') NOT NULL DEFAULT 'none',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  transaction_id VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shipping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  tracking_id VARCHAR(128) NULL,
  status ENUM('pending','in_transit','delivered','delayed','cancelled') NOT NULL DEFAULT 'pending',
  courier_partner VARCHAR(128) NULL,
  expected_delivery_date DATETIME NULL,
  address TEXT,
  notes TEXT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  discount DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  expiry_date DATE NOT NULL,
  status ENUM('active','expired','disabled') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  website_name VARCHAR(255),
  logo_url VARCHAR(511),
  seo_title VARCHAR(255),
  seo_description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(64),
  social_links JSON,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (id, name, description, created_at) VALUES
  (1, 'Admin', 'Administrator access with full control', UTC_TIMESTAMP()),
  (2, 'Manager', 'Manager with access to reports and users', UTC_TIMESTAMP()),
  (3, 'Staff', 'Staff members with order and catalog access', UTC_TIMESTAMP()),
  (4, 'Delivery Agent', 'Delivery agent with shipping assignment access', UTC_TIMESTAMP()),
  (5, 'User', 'Standard customer account', UTC_TIMESTAMP());
