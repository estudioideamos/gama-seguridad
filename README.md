# GAMA Seguridad Integral

Sitio institucional de **GAMA Seguridad Integral S.A.**, orientado a presentar servicios de protección ejecutiva, seguridad electrónica y ciberseguridad, custodia de mercadería en tránsito e insumos de seguridad.

**Sitio publicado:** [seguridadgama.com.ar](https://seguridadgama.com.ar/)

## Alcance

- Presentación institucional y propuesta de valor.
- Servicios de protección para turistas y viajeros de negocios.
- Seguridad electrónica y ciberseguridad.
- Custodia de mercadería en tránsito.
- Catálogo informativo de insumos de seguridad.
- Formulario de contacto y canales de consulta.
- Diseño adaptable a celulares, tablets y escritorio.

## Tecnología

Sitio estático construido con HTML, CSS y JavaScript. Los recursos visuales se encuentran en `assets/`; la integración del formulario se mantiene separada en `server/`.

## Estructura

```text
.
├── index.html
├── assets/
├── server/
├── CNAME
├── robots.txt
├── sitemap.xml
└── llms.txt
```

## Desarrollo local

No requiere compilación. Puede abrirse `index.html` o servirse la carpeta con cualquier servidor HTTP local. Para probar el formulario completo es necesario configurar el receptor indicado en `server/`.

## Publicación

La rama `main` se publica con GitHub Pages mediante el flujo de `.github/`. El archivo `CNAME` conserva el dominio personalizado.

## SEO y seguridad

Incluye metadatos sociales, URL canónica, sitemap, robots, información legible por asistentes y una política de seguridad de contenido. El código público no debe contener credenciales ni claves privadas.

## Créditos

Diseño y desarrollo web por [Estudio Ideamos](https://ideamos.com.ar/).
