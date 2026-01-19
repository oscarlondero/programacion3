# Programación III – Práctica Semana 8 (Clases 15 y 16)

**Tema:** Update/Delete + Soft Delete (`is_active`) + Filtros + UI (editar/eliminar) usando **PHP 8 + MySQL + Eloquent (standalone)**.

## Objetivo
- Completar el CRUD “real” del ejemplo (sin frameworks) agregando:
  - **Soft delete**: `items.is_active` (1 activo / 0 inactivo)
  - **Update**: `PUT /api/items/{id}`
  - **Delete** (soft): `DELETE /api/items/{id}`
  - Filtro por activos en endpoints de listado (por defecto devuelve solo activos)
  - Opción `?all=1` para incluir inactivos
- Actualizar la UI:
  - botón **Editar** (update)
  - botón **Eliminar** (soft delete)
  - checkbox **Mostrar inactivos**

## Requisitos
- XAMPP en Windows (Apache + MySQL/MariaDB)
- PHP 8.x
- Composer instalado

## Instalación (paso a paso)
1) Descomprimir la carpeta del proyecto en:
   `C:\xampp\htdocs\prog3_semana8_base\`

2) Iniciar **Apache** y **MySQL** desde XAMPP.

3) Instalar dependencias (en la carpeta del proyecto):
```bash
composer install
```

4) Crear base y tabla `items` (incluye `is_active`):
- Abrir phpMyAdmin
- Ejecutar: `install/01_items.sql`

5) Crear `categories` y relación 1:N:
- Ejecutar: `install/02_categories.sql`

> Si venís de una versión anterior sin `is_active`, podés correr **solo una vez**:
> - `install/03_softdelete.sql`

## URLs para probar
- Health:
  - `http://localhost/prog3_semana8_base/public/health`
- UI (fetch + filtros + editar/eliminar):
  - `http://localhost/prog3_semana8_base/public/items_ui.html`

## Endpoints API
### Listados
- Categorías:
  - `GET /api/categories`
- Items (por defecto solo activos):
  - `GET /api/items`
- Items de una categoría (solo activos):
  - `GET /api/categories/{id}/items`
- Incluir inactivos:
  - `GET /api/items?all=1`
  - `GET /api/categories/{id}/items?all=1`

### Crear
- Crear item:
  - `POST /api/items`
  - Body ejemplo:
```json
{ "name": "Lapiz", "qty": "3", "category_id": "1" }
```

### Update
- Editar item:
  - `PUT /api/items/{id}`
  - Body ejemplo:
```json
{ "name": "Lapiz negro", "qty": "10", "category_id": "2" }
```
  - Respuestas:
    - 200 ok
    - 400 errors (validación)
    - 404 err (no encontrado)

### Delete (soft)
- Eliminar (soft):
  - `DELETE /api/items/{id}`
  - Efecto: `is_active=0`
  - Respuestas:
    - 200 ok
    - 404 err (no encontrado)

## Pruebas rápidas obligatorias (evidencias)
1) En UI: crear un item **activo** y verlo en el listado.
2) En UI: editar un item (cambiar nombre/qty/categoría) y ver reflejado el cambio.
3) En UI: eliminar un item (soft) y ver que **desaparece** del listado activo.
4) Activar “Mostrar inactivos” y verificar que el item eliminado aparece en gris.

**Evidencias:**
- Captura 1: edición OK
- Captura 2: eliminación OK
- Captura 3: toggle “Mostrar inactivos” mostrando el item inactivo
- Commit/tag: `semana8-softdelete-update`

## Errores típicos
- **PUT/DELETE no llegan**: revisar que el proyecto esté dentro de `htdocs` y se acceda vía `public/`.
- **JSON roto** (“Unexpected token <”): suele ser warning/notice que imprime HTML. Desactivar display_errors y revisar logs.
- **SQL 02**: si se ejecuta más de una vez, puede fallar en índices/foreign key; reiniciar base o borrar constraints.
