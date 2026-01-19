USE prog3;

-- Semana 7: categorías + relación 1:N (Category -> Items)
-- Ejecutar una sola vez.

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Agregamos category_id a items (si tu motor no soporta IF NOT EXISTS, ejecutar manualmente)
ALTER TABLE items
  ADD COLUMN IF NOT EXISTS category_id INT UNSIGNED NULL;

-- Index y FK
ALTER TABLE items
  ADD INDEX idx_items_category (category_id);

ALTER TABLE items
  ADD CONSTRAINT fk_items_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

-- Datos de ejemplo (si ya existen, el INSERT IGNORE los omite)
INSERT IGNORE INTO categories (id, name, created_at, updated_at) VALUES
(1, 'Utiles', NOW(), NOW()),
(2, 'Libreria', NOW(), NOW()),
(3, 'Varios', NOW(), NOW());

-- Si había items viejos sin categoría, se asignan a la categoría 1
UPDATE items SET category_id = 1 WHERE category_id IS NULL;
