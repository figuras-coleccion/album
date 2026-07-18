# Primera carga al repositorio vacío

Extraer el contenido de este ZIP dentro de una carpeta local y ejecutar:

```bash
git init
git branch -M main
git remote add origin https://github.com/figuras-coleccion/album.git
git add .
git commit -m "Importar fuente base Panini 2026"
git push -u origin main
```

Después de confirmar que `main` quedó correctamente cargada, crear el respaldo:

```bash
git checkout -b backup/fuente-original-20260715
git push -u origin backup/fuente-original-20260715
git checkout main
```

Para comenzar el rediseño sin tocar la versión base:

```bash
git checkout -b feature/redesign-album
git push -u origin feature/redesign-album
```
