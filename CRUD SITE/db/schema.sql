-- Create database and items table
CREATE DATABASE IF NOT EXISTS items_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE items_app;

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Least-privilege user (adjust password as needed)
CREATE USER 'items_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON items_app.items TO 'items_user'@'localhost';
FLUSH PRIVILEGES;

-- Seed data
INSERT INTO items (title, description) VALUES
  ('First Item', 'This is the first item.'),
  ('Second Item', 'Another item for testing.');
