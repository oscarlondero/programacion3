CREATE DATABASE IF NOT EXISTS prog3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE prog3;

CREATE TABLE IF NOT EXISTS items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  qty INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed opcional (para que el listado no arranque vacío)
INSERT INTO items (name, qty, created_at, updated_at)
VALUES
('Lapiz', 3, NOW(), NOW()),
('Cuaderno', 5, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at=updated_at;
