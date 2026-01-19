CREATE DATABASE IF NOT EXISTS prog3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE prog3;

CREATE TABLE IF NOT EXISTS items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  qty INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Opcional: índice para filtrar activos (ejecutar una sola vez)
-- ALTER TABLE items ADD INDEX idx_items_active (is_active);
