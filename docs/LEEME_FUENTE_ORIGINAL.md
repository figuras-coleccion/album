# PANINI 2026 — FUENTE PARA MAPEO Y MEJORAS

## Objetivo
Este paquete está preparado para cargarlo como fuente en un nuevo proyecto de trabajo.
Permite mapear la aplicación actual, revisar su interfaz y aplicar cambios rápidos,
especialmente en el sistema de Match.

## Fuente
- Repositorio: eliparck-ai/panini2026
- Rama principal: main
- Backup utilizado: PANINI_TOTAL_20260715_162549
- Paquete generado: 2026-07-15 16:45:53

## Contenido
- 00_DOCUMENTACION: árbol de archivos, historial y datos Git.
- 01_CODIGO_FUENTE: proyecto React/Vite sin node_modules ni secretos.
- 02_FIREBASE_MAPA_SEGURO: configuración, reglas e inventario sin datos personales.
- 03_SUPABASE_MAPA_SEGURO: esquema, tipos y Edge Functions sin claves ni dumps privados.
- 04_MATCH_ACTUAL: referencias, extractos y archivos completos relacionados con el Match.
- 05_BUILD_ACTUAL: compilación vigente, cuando estaba disponible.

## Datos confirmados
- GitHub: eliparck-ai/panini2026
- Firebase Project ID: panini2026-eliparck
- Firebase Realtime Database: panini2026-eliparck-default-rtdb
- Framework: React + Vite
- Autenticación vigente en el código: Firebase Authentication
- Persistencia vigente en el código principal: Firebase Realtime Database

## Seguridad
Este ZIP está pensado para análisis y desarrollo.
No contiene usuarios, contraseñas, tokens, API keys ni dumps de producción con información personal.
El backup privado total permanece en OneDrive y no debe subirse como fuente pública.

## Restauración local básica
1. Abrir 01_CODIGO_FUENTE.
2. Ejecutar npm install o npm ci.
3. Completar las variables indicadas en .env.example, cuando exista.
4. Ejecutar npm run dev.

## Prioridad inicial sugerida
Revisar primero 04_MATCH_ACTUAL y el componente MatchFinder.
