# Programación III – Semana 4 (Clase 8 Práctica)

Paquete base para **XAMPP (Windows)** con:
- Router a mano
- MySQL + Eloquent (standalone)
- API JSON: `GET /api/items` y `POST /api/items` (body JSON)
- UI mínima: `public/items_ui.html` que consume la API con `fetch()`

## 1) Copiar a XAMPP
Descomprimir la carpeta en:

```
C:\xampp\htdocs\prog3_semana4_base\
```

## 2) Prender servicios
En el Panel de XAMPP:
- Iniciar **Apache**
- Iniciar **MySQL**

## 3) Instalar dependencias (Composer)
Desde la raíz del proyecto:

```
composer install
```

> Si `composer` no se reconoce, instalar Composer en Windows o usar la terminal integrada.

## 4) Crear Base de Datos y Tabla
Abrir `http://localhost/phpmyadmin` y ejecutar el SQL:

- `install/01_items.sql`

Esto crea la DB `prog3` y la tabla `items`.

## 5) Probar endpoints y UI
### Endpoints (JSON)
- Health: 
  - `http://localhost/prog3_semana4_base/public/health`
- Listado (API):
  - `http://localhost/prog3_semana4_base/public/api/items`
- Form tradicional (sigue existiendo):
  - `http://localhost/prog3_semana4_base/public/items/new`

### UI con fetch (lo nuevo)
- `http://localhost/prog3_semana4_base/public/items_ui.html`

## 6) Pruebas rápidas obligatorias
1) UI carga listado (aunque esté vacío)
2) Crear item OK → aparece en listado
3) Error name (vacío o < 3) → muestra validación
4) Error qty (no numérico) → muestra validación

## 7) Contrato de la API
### GET /api/items (200)
```json
{ "ok": true, "items": [ {"id":1,"name":"Yerba","qty":2,...} ] }
```

### POST /api/items
Request (JSON):
```json
{ "name": "Yerba", "qty": "2" }
```
Éxito (201):
```json
{ "ok": true, "item": {"id":1,"name":"Yerba","qty":2,...} }
```
Error validación (400):
```json
{ "ok": false, "errors": { "name": "...", "qty": "..." } }
```

## 8) Errores típicos (solucionario rápido)
- **.htaccess no funciona / rutas 404**: habilitar `mod_rewrite` y `AllowOverride All` en Apache.
- **500 al tocar DB**: revisar `config/db.php` (host, usuario, password) y que MySQL esté iniciado.
- **JSON roto**: evitar warnings/prints antes de responder; no usar `var_dump`.
- **POST API no recibe datos**: recordar que la API lee JSON desde `php://input`, no `$_POST`.

## Evidencia para entregar
- commit/tag: `semana4-api-fetch`
- 3 capturas: lista, alta OK, error validación
- bitácora 3 líneas: hecho / falta / bloqueo
