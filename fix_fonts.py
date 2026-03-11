import os

filepath = 'd:/Project/heartLink/mockup/aoonjai-app.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Make the changes
content = content.replace("'Sarabun',sans-serif", "'Outfit', 'Noto Sans Thai', sans-serif")
content = content.replace("'Sarabun', sans-serif", "'Outfit', 'Noto Sans Thai', sans-serif")
content = content.replace("font-family:'Sarabun',sans-serif", "font-family: var(--font-thai)")
content = content.replace("font-family: 'Sarabun', sans-serif", "font-family: var(--font-thai)")

content = content.replace("'Noto Serif Thai',serif", "'Outfit', 'Noto Sans Thai', sans-serif")
content = content.replace("'Noto Serif Thai', serif", "'Outfit', 'Noto Sans Thai', sans-serif")
content = content.replace("font-family:'Noto Serif Thai',serif", "font-family: var(--font-thai)")
content = content.replace("font-family: 'Noto Serif Thai', serif", "font-family: var(--font-thai)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated font references in {filepath}")
