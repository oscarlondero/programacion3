# Programacion III - Semana 3 (Clase 6 Practica) - Paquete base

Este paquete esta pensado para correr en **XAMPP (Windows)** con **router a mano**.

## Que trae
- Router manual (Front Controller) en `public/index.php`
- `.htaccess` para enviar rutas a `index.php`
- Endpoint JSON: `GET /health`
- Form HTML: `GET /items/new`
- Endpoints con Eloquent + MySQL:
  - `GET /items` (lista items en JSON)
  - `POST /items` (crea item en DB y devuelve 201 o 400)
- Modelo Eloquent: `src/Model/Item.php`
- SQL de instalacion: `install/01_items.sql`

## Instalacion paso a paso (XAMPP)

### 1) Copiar el proyecto
1. Descomprimir la carpeta en: `C:\xampp\htdocs\prog3_semana3_base\`
2. Confirmar que existe: `C:\xampp\htdocs\prog3_semana3_base\public\index.php`

### 2) Instalar dependencias (Composer)
En una terminal (PowerShell o CMD) posicionada en la raiz del proyecto:

```bash
composer install
```

Si Composer no esta instalado, instalarlo y reiniciar la terminal.

### 3) Crear DB y tabla
Abrir phpMyAdmin (desde XAMPP) y ejecutar el script:
- Archivo: `install/01_items.sql`

Por defecto usa:
- DB: `prog3`
- User: `root`
- Password: vacio

Esto se ajusta en `config/db.php`.

### 4) Probar endpoints
Suponiendo que la carpeta se llama `prog3_semana3_base`:

- Healthcheck:
  - URL: `http://localhost/prog3_semana3_base/public/health`
  - Esperado: JSON con ok/time/php

- Formulario:
  - URL: `http://localhost/prog3_semana3_base/public/items/new`

- Listado (JSON):
  - URL: `http://localhost/prog3_semana3_base/public/items`

### 5) Pruebas rapidas obligatorias
1. Alta OK: name >= 3, qty entero >= 0  -> 201
2. Error name vacio o corto -> 400 con errors.name
3. Error qty no numerico -> 400 con errors.qty
4. Verificar que luego del alta el item aparece en `GET /items`

## Evidencia a entregar (para el cierre de clase)
- Commit/tag con nombre sugerido: `semana3-eloquent`
- Captura de `GET /items` con datos
- Captura de `POST /items` OK (201)
- Captura de `POST /items` error (400)
- Bitacora 3 lineas: Hecho / Falta / Bloqueo

## Notas de solucion rapida
- Si ves 404 en todas las rutas: revisar `AllowOverride` y `mod_rewrite` (XAMPP) y que exista `.htaccess` en `public/`.
- Si el JSON sale roto: desactivar warnings en pantalla y evitar `var_dump`.
- Si falla la conexion DB: revisar `config/db.php` (host, database, user).
