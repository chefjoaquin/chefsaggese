# Automatizaciones de ManyChat — Instagram @joaquinsaggese

> Para configurar en ManyChat (plan Pro, ~15 USD/mes, necesario para palabras clave en comentarios y etiquetas). Conectar la cuenta de Instagram profesional desde ManyChat → Settings → Instagram.
> Reemplazar `[LINK_GUIA]` por la URL del PDF (ej. tu-dominio.com/tu-primer-yate.pdf) y `[LINK_VENTA]` por la página de venta.

## Etiquetas (tags)
| Tag | Cuándo se pone |
|---|---|
| `lead_yate` | Pidió la guía |
| `email_ok` | Dejó su email |
| `perfil_espana` / `perfil_latam` | Respondió de dónde es |
| `interes_programa` | Escribió PROGRAMA o tocó "quiero entrar" |
| `contratante` | Escribió CHEF (capitanes, agencias, clientes) |
| `cliente` | Compró (se marca a mano o por integración Hotmart → ManyChat vía Zapier/Make) |

---

## Flujo 1 — "YATE" (comentario en reel o post)
**Disparador:** Comentario en cualquier publicación que contenga `YATE` (también: yate, yates, YATES).

**1. Respuesta pública automática al comentario** (rotar para que no parezca bot):
- "¡Te lo mandé por mensaje! 📩"
- "Revisá tus mensajes, ahí está 🛥️"
- "¡Listo! Mirá tu bandeja de entrada 👨‍🍳"

**2. DM 1:**
> ¡Hola {nombre}! Soy Joaquín 👨‍🍳
> Hace unos años estaba mandando CVs sin respuesta. Me rechazaron en 22 entrevistas. Hoy cocino en superyates.
> Te armé una guía gratis con los primeros pasos reales para entrar: papeles, cuánto cuesta y qué buscan las agencias.
> ¿Te la mando?
> **[Botón: ¡Sí, mandámela! 🛥️]**

*(El botón es importante: Instagram exige que la persona responda para poder seguir enviando mensajes.)*

**3. DM 2 (al tocar el botón):**
> ¡Genial! Para mandártela y avisarte cuando subo contenido nuevo, ¿cuál es tu email? 📧

→ Guardar en campo `email`, tag `email_ok`. Si no responde en 10 min, mandar igual el link (no perder al lead).

**4. DM 3:**
> Acá la tenés 👇
> [LINK_GUIA]
> Una pregunta rápida para ayudarte mejor: ¿desde dónde me escribís?
> **[Botones: 🇪🇸 España · 🌎 Latinoamérica · 🌍 Otro]**

→ Tag `perfil_espana` / `perfil_latam`.

**5. DM 4 (inmediato):**
> Perfecto. Leela con calma: en la página 4 está el orden de los papeles, que es donde más plata pierde la gente.
> Mañana te cuento el error que me costó meses a mí. 😉

**6. Secuencia (Sequences en ManyChat):**
- **+24 h:** "El error que me costó meses: llegar al puerto en la temporada equivocada. El Mediterráneo contrata entre marzo y mayo. Si llegás en noviembre, vas a gastar ahorros sin trabajar. ¿Ya sabés cuándo te gustaría ir? **[Este año] [El que viene] [Todavía no sé]**"
- **+48 h:** "Lo que más mira un capitán no es tu técnica. Es si sos estable, limpio y fácil de convivir. Lo aprendí en la galley. ¿Querés que te cuente cómo armo un CV que pasa el filtro? **[Sí]**" → responde con tip + link a reel de CV.
- **+72 h:** "Te cuento algo: estoy abriendo *De la cocina al yate*, el programa con todo el camino paso a paso. Los primeros 20 entran a precio de fundador y con una llamada en vivo al mes conmigo. ¿Querés ver de qué se trata? **[Quiero verlo]**" → [LINK_VENTA], tag `interes_programa`.
- **+5 días (si no hizo clic):** "Última cosa y no te molesto más 🙏 Quedan [X] plazas de fundador. Si tenés alguna duda (inglés, papeles, plata), respondeme acá y te contesto yo."

## Flujo 2 — "PROGRAMA" (mensaje directo o comentario)
**Disparador:** DM o comentario con `PROGRAMA`.
> ¡Hola {nombre}! 🙌 *De la cocina al yate* es el camino completo para trabajar como chef en superyates: papeles, CV, portfolio, agencias, entrevista, trial y cómo trabajar en una galley.
> Precio de fundador: **$297** (o 3 cuotas de $109), solo para los primeros 20.
> 👉 [LINK_VENTA]
> ¿Tenés alguna duda? Escribila acá y te respondo yo.

→ Tag `interes_programa`. **Notificar a Joaquín** (Live Chat) si la persona escribe una pregunta: estas conversaciones se cierran a mano.

## Flujo 3 — "CHEF" (contratantes)
**Disparador:** DM o comentario con `CHEF`, o palabras: hire, charter, booking, available, disponibilidad.
> Hi {nombre}, thanks for reaching out! 👨‍🍳
> I'm Joaquín, yacht & private chef (Zuma, Cap Rocat, Maybourne Riviera, DO & CO). Here's my CV & portfolio: [LINK_CV]
> What dates and location are you looking at? I'll get back to you personally.

→ Tag `contratante`. **Notificación inmediata a Joaquín.** Prioridad máxima: es trabajo.

## Flujo 4 — Respuesta a historias
**Disparador:** respuesta a una historia con `YATE` → mismo Flujo 1.

## Flujo 5 — Bienvenida a nuevos seguidores (opcional, con moderación)
> ¡Gracias por seguirme! 🛥️ Si sos cocinero y querés trabajar en yates, escribime YATE y te mando la guía gratis.

## Buenas prácticas
- En cada reel para cocineros: CTA en el video **y** en el texto: "Comentá YATE y te mando la guía gratis".
- Revisar Live Chat de ManyChat 1 vez al día (10 min): las dudas respondidas por Joaquín venden más que cualquier automatización.
- Medir cada semana: comentarios YATE → DMs enviados → emails → clics a la página de venta → ventas.
