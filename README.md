# CIMBRA Constructora S.A. · sitio web

Código y recursos del sitio institucional de CIMBRA Constructora S.A. Los videos y las imágenes de servicios son ilustrativos; la galería de obras conserva espacios grises hasta incorporar material correspondiente a cada obra.

## Generar la web

Requiere Node.js 20 o posterior. No tiene dependencias de paquetes.

```sh
npm run build
```

La salida estática queda en `dist/`. El archivo `vercel.json` deja configurados el comando de construcción, el directorio de salida y encabezados de seguridad para cuando el titular conecte el repositorio. No hacen falta variables de entorno.

La web no carga analítica ni recursos de terceros. Los enlaces a WhatsApp, Instagram, Facebook y el sitio institucional se abren únicamente cuando se seleccionan. Las páginas generadas incluyen `noindex` y `robots.txt` bloquea el rastreo mientras este proyecto se use como vista de revisión.

Este repositorio es público: todo archivo confirmado queda accesible a cualquier persona. No contiene respaldos locales, archivos de QA, originales de trabajo ni credenciales.
