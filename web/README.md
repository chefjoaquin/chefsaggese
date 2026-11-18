# Web de Chef Joaquín

Web estática (HTML + CSS, sin dependencias). Se publica gratis en Netlify (arrastrar esta carpeta en https://app.netlify.com/drop) o Vercel, y se conecta el dominio.

| Página | Para quién | Uso |
|---|---|---|
| `links.html` | Todos | **Link de la bio de Instagram** (reemplaza a linktr.ee). Agregar `img/avatar.jpg`. |
| `index.html` | Cocineros | Página de venta del programa |
| `chef.html` | Capitanes, agencias, clientes (EN) | CV y portfolio online ("Hire me") |
| `gracias.html` | Compradores | Página después del pago (configurarla en Hotmart como "página de agradecimiento") |
| `tu-primer-yate.pdf` | Leads | Guía gratis (link para ManyChat) |

## Datos a reemplazar (buscar y reemplazar)
| Texto | Dónde | Por qué |
|---|---|---|
| `HOTMART_LINK_PAGO_UNICO` | index.html | Link de pago $297 |
| `HOTMART_LINK_3_CUOTAS` | index.html | Link de pago 3 × $109 |
| `HOTMART_AREA_MIEMBROS` | gracias.html | Acceso al curso |
| `WHATSAPP_COMUNIDAD` | gracias.html | Grupo de fundadores |
| `FECHA_LLAMADA` | gracias.html | Primera llamada en vivo |
| `CONTACT_EMAIL` | chef.html | Email profesional |
| `CONTACT_WHATSAPP` | chef.html | Número con código de país, sin + |
| `CV_PDF_URL` | chef.html | Tu CV en PDF (subirlo como `cv-joaquin-saggese.pdf`) |
| Fotos "Plate photo" | chef.html | 6 fotos de platos en `img/` |

## Estructura sugerida del dominio
- `chefjoaquin.com` → links.html (o chef.html)
- `chefjoaquin.com/yate` → index.html
- `chefjoaquin.com/chef` → chef.html
