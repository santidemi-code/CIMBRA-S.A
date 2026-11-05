# CIMBRA Constructora S.A. · sitio web

Código y recursos del sitio institucional de CIMBRA Constructora S.A. Los videos y las imágenes de servicios son ilustrativos, salvo las fotos reales de `public/assets/images/obras/` (Ingeniería, Espacios públicos y Confianza); la galería de obras conserva espacios grises hasta incorporar material correspondiente a cada obra.

## Generar la web

Requiere Node.js 20 o posterior. No tiene dependencias de paquetes.

```sh
npm run build
```

La salida estática queda en `dist/`. El archivo `vercel.json` deja configurados el comando de construcción, el directorio de salida y encabezados de seguridad para cuando el titular conecte el repositorio. No hacen falta variables de entorno.

La web no carga analítica ni recursos de terceros. Los enlaces a WhatsApp, Instagram, Facebook y el sitio institucional se abren únicamente cuando se seleccionan. Las páginas generadas incluyen `noindex` y `robots.txt` bloquea el rastreo mientras este proyecto se use como vista de revisión.

Este repositorio es público: todo archivo confirmado queda accesible a cualquier persona. No contiene respaldos locales, archivos de QA, originales de trabajo ni credenciales.

## Firma de beta

Al pie del sitio, en una franja clara debajo del footer, va la firma «Diseñado y desarrollado por beta». Enlaza al Instagram de beta en una pestaña nueva. Es el componente `firma-beta` v1 de beta: el marcado está en `src/firma-beta.mjs` y los estilos en `public/assets/firma-beta.css`, y no se editan acá. La franja está al final de `public/assets/styles.css`.
