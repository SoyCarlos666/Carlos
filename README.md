# 𝙀𝙇 𝙃𝘼𝘿𝙀𝙎𝙎𝙀𝙄⁶⁶⁶ — Portfolio

Portafolio profesional para gestión de comunidades Minecraft.

## Archivos

- `index.html` — página principal.
- `style.css` — diseño, responsive y animaciones.
- `script.js` — interacciones, loader, presencia y renderizado.
- `config.js` — contenido editable.
- `admin.html` — panel de administración.
- `admin.css` — estilos del panel.
- `admin.js` — lógica del panel.

## Discord

ID configurado:

`1484659327716294657`

La presencia se consulta mediante Lanyard. No pongas tokens de Discord en el frontend.

## GitHub Pages

Sube todos los archivos juntos en la misma carpeta y asegúrate de que `index.html`, `config.js`, `script.js` y `style.css` estén en el mismo nivel.

El error de la versión anterior se debía a que `PORTFOLIO_CONFIG` estaba declarado como una variable `const` y luego se intentaba leer como `window.PORTFOLIO_CONFIG`. Esta versión usa `window.PORTFOLIO_CONFIG`, por lo que ambos archivos se comunican correctamente.

## Panel Admin

`admin.html` funciona en el navegador y guarda cambios en `localStorage`.

Eso significa que esos cambios no se publican automáticamente para todos los visitantes de GitHub Pages. Para un administrador real con cambios globales se necesita un backend o una base de datos.
