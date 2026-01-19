# Programación III (TUP UTN) – Parcial 1 – Proyecto Base (Individual)

## Duración
- 2 horas.

## Objetivo
Modificar este proyecto (monolito PHP + API JSON + UI con fetch) y entregar evidencias que demuestren funcionamiento.

## Requisitos (XAMPP en Windows)
- Apache + MySQL activos.
- PHP 8.x.
- Composer instalado.

## Instalación (previa al parcial)
1) Copiar la carpeta del proyecto dentro de:
- `C:\xampp\htdocs\prog3_parcial1\`

2) Instalar dependencias (una sola vez):
- Abrir terminal en la carpeta del proyecto y ejecutar:
  - `composer install`

3) Crear DB y tabla:
- Abrir phpMyAdmin y ejecutar `install/01_init.sql`.

## URLs de prueba
- Healthcheck: `http://localhost/prog3_parcial1/public/health`
- UI: `http://localhost/prog3_parcial1/public/items_ui.html`
- API list: `http://localhost/prog3_parcial1/public/api/items`

## PARCIAL 1 – Tareas (Individual)
Las tareas están marcadas en el código con el texto **`TODO PARCIAL`**.

### Tarea 1 – API Stats (GET)
Implementar:
- `GET /api/items/stats`

Respuesta esperada (200):
```json
{
  "ok": true,
  "stats": { "count": 12, "total_qty": 87 }
}
```

### Tarea 2 – Validación de duplicados (POST)
Modificar `POST /api/items` para evitar duplicados por `name`:
- Ignorar mayúsculas/minúsculas.
- Ignorar espacios al inicio/fin.

Si existe duplicado:
- Status **400**
- JSON:
```json
{ "ok": false, "errors": { "name": "Ya existe un item con ese nombre." } }
```

### Tarea 3 – UI: mostrar stats y manejar error
En la UI:
- Mostrar `count` y `total_qty` arriba del listado.
- Cargar stats desde `/api/items/stats`.
- Si el POST devuelve error por duplicado, mostrarlo en el panel de errores.

## Evidencias obligatorias (entrega)
1) Captura UI con stats visibles.
2) Captura UI con error de duplicado visible.
3) Captura UI con listado con datos.
4) (Opcional) Captura de Postman/navegador de `/api/items/stats`.

## Entrega
- Opción A: ZIP
  - Nombre: `P1_Apellido_Nombre.zip`
- Opción B: Repositorio
  - Tag: `P1-final`

## Nota
Si en el aula no hay internet estable, el docente puede distribuir el proyecto **con la carpeta `vendor/` ya instalada** (ejecutando `composer install` previamente).
