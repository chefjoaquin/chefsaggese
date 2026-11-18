"""Genera los descargables editables: CV (Word) y presupuesto (Excel)."""
from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = 'curso/descargables/'
GOLD = RGBColor(0xA8, 0x82, 0x2F)

# ---------- CV ----------
d = Document()
for s in d.sections:
    s.top_margin = s.bottom_margin = Cm(1.6); s.left_margin = s.right_margin = Cm(1.9)
st = d.styles['Normal']; st.font.name = 'Calibri'; st.font.size = Pt(10.5)

def h(text):
    p = d.add_paragraph(); r = p.add_run(text.upper()); r.bold = True; r.font.size = Pt(10); r.font.color.rgb = GOLD
    p.paragraph_format.space_before = Pt(10); p.paragraph_format.space_after = Pt(2)
    return p
def line(text, bold=False, italic=False, size=None):
    p = d.add_paragraph(); r = p.add_run(text); r.bold = bold; r.italic = italic
    if size: r.font.size = Pt(size)
    p.paragraph_format.space_after = Pt(1); return p
def bullet(text):
    p = d.add_paragraph(text, style='List Bullet'); p.paragraph_format.space_after = Pt(0)

t = d.add_paragraph(); r = t.add_run('[FULL NAME]'); r.bold = True; r.font.size = Pt(22)
line('Sole Chef / Sous Chef  ·  Mediterranean · Healthy · International', size=12, italic=True)
line('[Nationality] · [Passports / visas: EU passport / B1-B2 / Schengen] · Non-smoker · No visible tattoos')
line('📞 [+00 000 000 000 (WhatsApp)]  ·  ✉ [email]  ·  📷 Portfolio: instagram.com/[your-portfolio]')
line('[Insert professional photo in the top-right corner: chef whites, plain background, smiling]', italic=True, size=9)

h('Profile')
line('[Mediterranean & Japanese-trained] chef with a background in [luxury hotels / fine dining]. '
     'Calm under pressure, clean and organised, focused on healthy, guest-tailored menus. '
     'Strong team player in small spaces, used to adapting to last-minute changes. Available from [date] in [port].')

h('Certificates')
for c in ['STCW Basic Safety Training — [centre], [month/year]',
          'ENG1 Medical — valid until [month/year]',
          'Food Hygiene Level 2 — [month/year]',
          "Ship's Cook Certificate — [if applicable]",
          'Driving licence — [if applicable]']:
    bullet(c)

h('Experience')
for role, place, dates, pts in [
    ('[Chef de Partie]', '[Hotel / Restaurant name], [City, Country]', '[MM/YYYY – MM/YYYY]',
     ['[Responsible for the cold section in a 120-cover fine dining restaurant]',
      '[Created weekly specials; reduced food waste by X%]', '[Trained 3 junior cooks]']),
    ('[Commis / Breakfast Chef]', '[Hotel name], [City, Country]', '[MM/YYYY – MM/YYYY]',
     ['[Breakfast à la carte for 200+ guests daily]', '[HACCP and allergen control]']),
]:
    p = d.add_paragraph(); r = p.add_run(f'{role} — {place}'); r.bold = True
    r2 = p.add_run(f'   {dates}'); r2.font.color.rgb = RGBColor(0x66, 0x66, 0x66); p.paragraph_format.space_after = Pt(0)
    for x in pts: bullet(x)

h('Skills')
for x in ['Cuisines: [Mediterranean, Japanese, Healthy, Middle Eastern, Pastry & bread]',
          'Dietary: [vegan, gluten-free, keto, halal, kosher, severe allergies]',
          'Galley: [provisioning, inventory, cost control, menu planning from preference sheets]',
          'Crew food: [balanced weekly crew menus]']:
    bullet(x)

h('Languages')
line('[Spanish — native]  ·  [English — professional]  ·  [Italian — basic]')

h('References')
line('[Name, position, company — phone — email]')
line('[Name, position, company — phone — email]')
d.save(OUT + 'Plantilla CV Yacht Chef (EN).docx')

# ---------- Presupuesto ----------
wb = Workbook(); ws = wb.active; ws.title = 'Presupuesto'
gold = PatternFill('solid', fgColor='C9A24D'); dark = PatternFill('solid', fgColor='0B0B0C')
thin = Side(style='thin', color='DDD4C2'); bd = Border(bottom=thin)
ws['A1'] = 'Presupuesto de entrada — Tu primer yate'; ws['A1'].font = Font(bold=True, size=16, color='F4EFE6'); ws['A1'].fill = dark
ws.merge_cells('A1:E1'); ws.row_dimensions[1].height = 30
ws['A2'] = 'Completá las celdas amarillas con tus números. Valores de referencia 2025-2026 (orientativos).'
ws['A2'].font = Font(italic=True, color='666666'); ws.merge_cells('A2:E2')
hdr = ['Concepto', 'Referencia (€)', 'Cantidad', 'Precio unitario (€)', 'Total (€)']
for i, x in enumerate(hdr, 1):
    c = ws.cell(row=4, column=i, value=x); c.font = Font(bold=True); c.fill = gold
rows = [
    ('Certificado médico ENG1', '100-200', 1, 150),
    ('STCW Basic Safety Training', '1.000-1.150', 1, 1050),
    ('Higiene alimentaria Level 2', '50-150', 1, 100),
    ('Visado B1/B2 (si aplica, tasa)', '~170 (185 USD)', 0, 170),
    ('Libreta de marino (si aplica)', 'variable', 0, 0),
    ('Vuelo al puerto', 'variable', 1, 400),
    ('Alojamiento crew house (noches)', '20-60 / noche', 42, 35),
    ('Comida y transporte (días)', '15-25 / día', 42, 20),
    ('Teléfono / datos', 'variable', 1, 30),
    ('Ropa de dockwalk (polo, bermuda, zapatillas)', '50-100', 1, 80),
    ('Imprevistos (10%)', '', 1, 0),
]
y = 4 + 1
yellow = PatternFill('solid', fgColor='FFF4C2')
for k, (a, ref, q, pu) in enumerate(rows):
    r = y + k
    ws.cell(row=r, column=1, value=a); ws.cell(row=r, column=2, value=ref)
    ws.cell(row=r, column=3, value=q).fill = yellow; ws.cell(row=r, column=4, value=pu).fill = yellow
    ws.cell(row=r, column=5, value=f'=C{r}*D{r}')
    for col in range(1, 6): ws.cell(row=r, column=col).border = bd
last = y + len(rows) - 1
imp = last
ws.cell(row=imp, column=4, value=f'=ROUND(SUM(E{y}:E{imp-1})*0.1,0)').fill = PatternFill(None)
tr = last + 2
ws.cell(row=tr, column=1, value='TOTAL NECESARIO').font = Font(bold=True, size=13)
ws.cell(row=tr, column=5, value=f'=SUM(E{y}:E{last})').font = Font(bold=True, size=13)
ws.cell(row=tr + 1, column=1, value='Ahorro actual')
ws.cell(row=tr + 1, column=5, value=0).fill = yellow
ws.cell(row=tr + 2, column=1, value='Te falta').font = Font(bold=True)
ws.cell(row=tr + 2, column=5, value=f'=MAX(0,E{tr}-E{tr+1})').font = Font(bold=True, color='A8822F')
ws.cell(row=tr + 3, column=1, value='Ahorro mensual posible')
ws.cell(row=tr + 3, column=5, value=300).fill = yellow
ws.cell(row=tr + 4, column=1, value='Meses hasta poder viajar').font = Font(bold=True)
ws.cell(row=tr + 4, column=5, value=f'=IF(E{tr+3}>0,ROUNDUP(E{tr+2}/E{tr+3},0),"-")').font = Font(bold=True, color='A8822F')
for r in range(y, tr + 5):
    for col in (4, 5): ws.cell(row=r, column=col).number_format = '#,##0 "€"'
ws.column_dimensions['A'].width = 46; ws.column_dimensions['B'].width = 18
ws.column_dimensions['C'].width = 11; ws.column_dimensions['D'].width = 20; ws.column_dimensions['E'].width = 16
ws.freeze_panes = 'A5'
wb.save(OUT + 'Presupuesto de entrada.xlsx')
print('ok')
