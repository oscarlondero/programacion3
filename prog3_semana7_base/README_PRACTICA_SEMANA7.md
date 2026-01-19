# Programación III – Práctica Semana 7 (Clases 13 y 14)

**Tema:** Relación 1:N con Eloquent (Category -> Items) + Endpoints REST + UI con fetch.

## Objetivo
- Agregar una nueva entidad `categories` y relacionarla con `items` mediante `items.category_id`.
- Implementar endpoints:
  - `GET /api/categories`
  - `GET /api/categories/{id}/items`
  - `POST /api/items` acepta `category_id` y lo valida
- Actualizar la UI para:
  - cargar categorías
  - filtrar items por categoría
  - crear items con categoría

## Requisitos
- XAMPP en Windows (Apache + MySQL/MariaDB)
- PHP 8.x
- Composer instalado

## Instalación (paso a paso)
1) Descomprimir la carpeta del proyecto en:
   `C:\xampp\htdocs\prog3_semana7_base\`

2) Iniciar **Apache** y **MySQL** desde XAMPP.

3) Instalar dependencias (en la carpeta del proyecto):
```bash
composer install
```

4) Crear la base y tabla `items`:
- Abrir phpMyAdmin
- Ejecutar: `install/01_items.sql`

5) Crear `categories` y relación 1:N:
- Ejecutar: `install/02_categories.sql`

## URLs para probar
- Health:
  - `http://localhost/prog3_semana7_base/public/health`
- UI (fetch + filtros):
  - `http://localhost/prog3_semana7_base/public/items_ui.html`

## Endpoints API
- Listar categorías:
  - `GET http://localhost/prog3_semana7_base/public/api/categories`

- Listar items (todas las categorías):
  - `GET http://localhost/prog3_semana7_base/public/api/items`

- Listar items de una categoría:
  - `GET http://localhost/prog3_semana7_base/public/api/categories/1/items`

- Crear item (JSON body):
  - `POST http://localhost/prog3_semana7_base/public/api/items`
  - Body ejemplo:
```json
{ "name": "Lapiz", "qty": "3", "category_id": "1" }
```

## Pruebas rápidas obligatorias (evidencias)
1) En UI se ven categorías cargadas en los selects.
2) Al elegir una categoría en el filtro, cambia el listado.
3) Crear un item con categoría válida funciona.
4) Intentar crear con `category_id` inválido devuelve 400 y se ve el error en UI.

## Errores típicos
- **mod_rewrite**: si no enruta, revisar `Apache -> httpd.conf` y que `AllowOverride All` esté habilitado para `htdocs`.
- **JSON roto**: si aparece “Unexpected token <”, normalmente el server devolvió HTML por un warning/error.
- **SQL 02**: si se ejecuta más de una vez puede fallar al crear index/FK. En ese caso, reiniciar DB o borrar constraint/index manualmente.
