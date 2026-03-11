import re

with open('d:/Project/heartLink/mockup/aoonjai-app.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace fonts
html = html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Noto+Serif+Thai:wght@500;700&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">'
)

html = html.replace("'Sarabun',sans-serif", "'Outfit', 'Noto Sans Thai', sans-serif")
html = html.replace("'Noto Serif Thai',serif", "'Outfit', 'Noto Sans Thai', sans-serif")

# Replace :root variables
root_pattern = re.compile(r':root\s*\{.*?\n\}', re.DOTALL)
new_root = """:root {
  --cream: #FFF8F0;
  --warm: #FFFDF9;
  --amber: #FFC857;
  --amber-l: #FFE6A8;
  --amber-d: #E6B04E;
  --terra: #FF6B6B;
  --sage: #4ECDC4;
  --sage-l: #E0F5F3;
  --brown: #FF6B6B;
  --brown-2: #E85555;
  --brown-l: #FF8A8A;
  --text: #2E261E;
  --text-2: #6B5E50;
  --text-3: #A89A8A;
  --border: #E0D8CE;
  --card: #FFFDF9;
  --shadow-sm: 0 2px 8px rgba(110, 80, 50, 0.08);
  --shadow: 0 4px 20px rgba(110, 80, 50, 0.12);
  --shadow-lg: 0 8px 40px rgba(110, 80, 50, 0.18);
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}"""

html = root_pattern.sub(new_root, html)

# Replace some inline hardcoded colors for the shell and header backgrounds to match
html = html.replace('background:#E8D5C4;', 'background:#FFF0E0;')
html = html.replace('radial-gradient(ellipse at 30% 20%, #c9a07a22, transparent 60%)', 'radial-gradient(ellipse at 30% 20%, #FF8A8A22, transparent 60%)')
html = html.replace('radial-gradient(ellipse at 80% 80%, #7a9e7e22, transparent 60%)', 'radial-gradient(ellipse at 80% 80%, #4ECDC422, transparent 60%)')
html = html.replace('#ddc9b4', '#F0EBE4')

with open('d:/Project/heartLink/mockup/aoonjai-app.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Styles updated successfully.")
