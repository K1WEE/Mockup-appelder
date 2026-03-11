import re

with open('d:/Project/heartLink/mockup/aoonjai-app.html', 'r', encoding='utf-8') as f:
    aoonjai = f.read()

with open('d:/Project/heartLink/mockup/index.html', 'r', encoding='utf-8') as f:
    index = f.read()

with open('d:/Project/heartLink/mockup/styles.css', 'r', encoding='utf-8') as f:
    styles = f.read()

# Extract the 4 screens from aoonjai-app.html
screens_match = re.search(r'(<!-- ════════════════════\s*HOME SCREEN\s*════════════════════ -->.*?)(?=<!-- ════════════════════\s*BOTTOM NAVIGATION)', aoonjai, re.DOTALL)
screens_html = screens_match.group(1)

# Rename classes in screens to map to index.html style
# aoonjai-app.html uses <div class="screen">
screens_html = screens_html.replace('class="screen active"', 'class="tab-content active"')
screens_html = screens_html.replace('class="screen"', 'class="tab-content hidden"')
screens_html = screens_html.replace('id="screen-home"', 'id="tab-home"')
screens_html = screens_html.replace('id="screen-chat"', 'id="tab-chat"')
screens_html = screens_html.replace('id="screen-remind"', 'id="tab-remind"')
screens_html = screens_html.replace('id="screen-stats"', 'id="tab-stats"')

# Extract CSS from aoonjai-app.html starting from CHAT SCREEN section
chat_css_start = aoonjai.find('/* ══════════════════════════\n   CHAT SCREEN')
reminders_end = aoonjai.find('/* ── TOAST ── */')

if chat_css_start != -1 and reminders_end != -1:
    extra_css = aoonjai[chat_css_start:reminders_end]
    # Replace variable names to match index.html theme
    extra_css = extra_css.replace('var(--card)', 'var(--warm-white)')
    extra_css = extra_css.replace('var(--sage)', 'var(--teal-soft)')
    extra_css = extra_css.replace('var(--sage-l)', '#E0F5F3')
    extra_css = extra_css.replace('var(--amber)', 'var(--gold)')
    extra_css = extra_css.replace('var(--amber-d)', 'var(--gold-dark)')
    extra_css = extra_css.replace('var(--amber-l)', 'var(--warning)')
    extra_css = extra_css.replace('var(--terra)', 'var(--coral)')
    extra_css = extra_css.replace('var(--brown)', 'var(--warm-gray-800)')
    extra_css = extra_css.replace('var(--cream)', 'var(--cream)')
    extra_css = extra_css.replace('var(--text-3)', 'var(--warm-gray-400)')
    extra_css = extra_css.replace('var(--text)', 'var(--warm-gray-800)')
    extra_css = extra_css.replace('var(--border)', 'var(--warm-gray-200)')
    
    # Check if extra_css is already in styles.css to avoid duplicates
    if 'CHAT SCREEN' not in styles:
        with open('d:/Project/heartLink/mockup/styles.css', 'a', encoding='utf-8') as f:
            f.write('\n\n' + extra_css)

# Replace the tabs inside index.html
# Find start of HOME TAB and end of ACTIVITY TAB
home_start = index.find('<!-- ===== HOME TAB: CARE DASHBOARD ===== -->')
nav_start = index.find('<!-- ===== BOTTOM NAV ===== -->')

if home_start != -1 and nav_start != -1:
    new_index = index[:home_start] + screens_html + '\n        ' + index[nav_start:]
    # Now update bottom nav data-tab names
    new_index = new_index.replace('data-tab="calendar"', 'data-tab="remind"')
    new_index = new_index.replace('data-tab="activity"', 'data-tab="stats"')
    
    with open('d:/Project/heartLink/mockup/index.html', 'w', encoding='utf-8') as f:
        f.write(new_index)

# Also copy the inner scripts from aoonjai-app to app.js, or just put them into index.html
# Let's extract script from aoonjai-app.html
script_start = aoonjai.find('<script>') + 8
script_end = aoonjai.find('</script>', script_start)
extra_script = aoonjai[script_start:script_end]

# Append extra inline script to the end of index.html before </body>
if '<script id="aoonjai-scripts">' not in new_index:
    modified_index = new_index.replace('</body>', f'<script id="aoonjai-scripts">{extra_script}</script>\n</body>')
    with open('d:/Project/heartLink/mockup/index.html', 'w', encoding='utf-8') as f:
        f.write(modified_index)

print("Merge completed!")
