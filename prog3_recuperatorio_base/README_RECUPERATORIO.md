# Programación III (TUP UTN) – Recuperatorio Parcial 1 – Proyecto Base (Individual)

## Duración
- 2 horas.

## Objetivo
Modificar este proyecto (monolito PHP + API JSON + UI con fetch) y entregar evidencias que demuestren funcionamiento.

## Requisitos (XAMPP en Windows)
- Apache + MySQL activos.
- PHP 8.x.
- Composer instalado.

## Instalación (previa al recuperatorio)
1) Copiar la carpeta del proyecto dentro de:
- `C:\xampp\htdocs\prog3_recuperatorio\`

2) Instalar dependencias (una sola vez):
- Abrir terminal en la carpeta del proyecto y ejecutar:
  - `composer install`

3) Crear DB y tabla:
- Abrir phpMyAdmin y ejecutar `install/01_init.sql`.
- Para limpiar datos entre pruebas: ejecutar `install/02_reset.sql`.

## URLs de prueba
- Healthcheck: `http://localhost/prog3_recuperatorio/public/health`
- UI: `http://localhost/prog3_recuperatorio/public/items_ui.html`
- API list: `http://localhost/prog3_recuperatorio/public/api/items`

---

## RECUPERATORIO – Tareas (Individual)
Las tareas están marcadas en el código con el texto **`TODO RECUP`**.

### R1 – API Latest (GET)
Implementar:
- `GET /api/items/latest?limit=5`

Reglas:
- Si `limit` no viene, usar **5**.
- `limit` debe ser entero **1..50**.
- Si `limit` es inválido: devolver **400** con:
```json
{ "ok": false, "errors": { "limit": "Limit inválido (1..50)." } }
```

Respuesta esperada (200):
```json
{ "ok": true, "items": [ ... ] }
```
Debe devolver los últimos items por `id` descendente.

### R2 – Validación extra en POST /api/items
Modificar `POST /api/items` para que:
- `name` **no** contenga números.

Si falla:
- Status **400**
- JSON:
```json
{ "ok": false, "errors": { "name": "El nombre no puede contener números." } }
```

> Mantener las validaciones previas (name mínimo 3, qty entero >= 0).

### R3 – UI: botón “Ver últimos”
En la UI:
- Agregar un botón **Ver últimos (5)**.
- Al hacer click, consumir `GET /api/items/latest?limit=5` y renderizar el listado (puede reemplazar el listado actual o mostrarlo como “modo últimos”).
- Mantener manejo de errores (mostrar en el panel de errores si hubiese).

---

## Evidencias obligatorias (entrega)
1) Captura UI mostrando “últimos 5” (o evidencia visual equivalente).
2) Captura UI mostrando error de validación por nombre con números.
3) Captura de respuesta exitosa de `/api/items/latest?limit=5` (navegador o Postman).
4) Captura de respuesta de error de `/api/items/latest?limit=0` (400).

## Entrega
- Opción A: ZIP
  - Nombre: `REC_Apellido_Nombre.zip`
- Opción B: Repositorio
  - Tag: `REC-final`

## Nota (sin internet estable)
Si en el aula no hay internet estable, el docente puede distribuir el proyecto **con la carpeta `vendor/` ya instalada** (ejecutando `composer install` previamente).
