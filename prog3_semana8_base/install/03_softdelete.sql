USE prog3;

-- Semana 8: Soft delete (items.is_active)
-- Si creaste la tabla items con el script 01_items.sql de Semana 8, NO necesitas correr este archivo.
-- Si venís de una versión anterior sin is_active, ejecutá este ALTER UNA sola vez.

ALTER TABLE items
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;

-- Opcional: índice para acelerar el filtro
-- ALTER TABLE items ADD INDEX idx_items_active (is_active);
