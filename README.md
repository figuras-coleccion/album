# Álbum Panini 2026

Código fuente base de la WebApp **Panini 2026**, desarrollada con React, Vite, Firebase Authentication y Firebase Realtime Database.

## Estado de esta entrega

- Fuente funcional tomada de `PANINI_FUENTE_NUEVO_PROYECTO_20260715_164551.zip`.
- La lógica, rutas, componentes y modelo Firebase existentes no fueron modificados.
- Se retiró únicamente el archivo accidental `NULecho`, que no forma parte de la aplicación.
- No se incluyen `node_modules`, `dist`, datos de usuarios, exportaciones de Firebase, contraseñas, llaves privadas ni tokens.
- No se ha desplegado esta entrega en producción.

## Instalación y ejecución

```bash
npm ci
npm run dev
```

## Validación de compilación

```bash
npm ci
npm run build
```

La compilación genera `dist/` y crea `dist/404.html` para el fallback de la SPA.

## Estructura de ramas recomendada

- `main`: línea base estable.
- `backup/fuente-original-20260715`: respaldo inmutable de esta línea base.
- `feature/redesign-album`: cambios visuales y funcionales aislados.

## Seguridad

El frontend conserva la configuración pública de Firebase necesaria para mantener compatibilidad. No deben agregarse al repositorio archivos `.env` reales, cuentas de servicio, exportaciones de usuarios ni llaves administrativas.

Antes de modificar o desplegar, revisar `docs/PLAN_MAESTRO.txt` y `docs/VERIFICACION_FINAL.md`.
