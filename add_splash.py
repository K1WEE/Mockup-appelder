import re
import os

filepath = 'd:/Project/heartLink/mockup/aoonjai-app.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS
css_to_add = """
    /* ── SPLASH SCREEN ── */
    .splash {
      position: absolute;
      inset: 0;
      z-index: 9999;
      background: linear-gradient(145deg, var(--terra) 0%, var(--amber) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .splash.fade-out {
      opacity: 0;
      transform: scale(1.05);
      pointer-events: none;
    }

    .splash-content {
      text-align: center;
      animation: splashEntry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .splash-heart {
      margin-bottom: 24px;
      animation: heartBeat 1.2s ease-in-out infinite;
    }

    .splash-title {
      font-family: 'Outfit', 'Noto Sans Thai', sans-serif;
      font-size: 2.8rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -1px;
      margin-bottom: 4px;
    }

    .splash-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
      font-family: 'Outfit', 'Noto Sans Thai', sans-serif;
    }

    @keyframes splashEntry {
      from { opacity: 0; transform: translateY(30px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes heartBeat {
      0%, 100% { transform: scale(1); }
      15% { transform: scale(1.15); }
      30% { transform: scale(1); }
      45% { transform: scale(1.1); }
    }
"""

if '.splash {' not in content:
    content = content.replace('/* ── PHONE SHELL (desktop preview) ── */', css_to_add + '\n    /* ── PHONE SHELL (desktop preview) ── */')

# 2. Add HTML
html_to_add = """
      <!-- ===== SPLASH SCREEN ===== -->
      <div id="splash-screen" class="splash">
          <div class="splash-content">
              <div class="splash-heart" id="splash-heart">
                  <svg viewBox="0 0 100 100" width="80" height="80">
                      <path
                          d="M50 88 C25 65, 0 45, 0 28 C0 12, 12 0, 28 0 C38 0, 46 6, 50 14 C54 6, 62 0, 72 0 C88 0, 100 12, 100 28 C100 45, 75 65, 50 88Z"
                          fill="url(#heartGrad)" />
                      <defs>
                          <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stop-color="#FF6B6B" />
                              <stop offset="100%" stop-color="#FFC857" />
                          </linearGradient>
                      </defs>
                  </svg>
              </div>
              <h1 class="splash-title">อุ่นใจ</h1>
              <p class="splash-subtitle">Smart Reminder สำหรับครอบครัว</p>
          </div>
      </div>
"""

if 'id="splash-screen"' not in content:
    content = content.replace('<div class="phone" id="app">', '<div class="phone" id="app">\n' + html_to_add)

# 3. Add JS
js_to_add = """
    // ── Preload/Splash ──
    function initSplash() {
      const splash = document.getElementById('splash-screen');
      if(splash) {
        setTimeout(() => {
          splash.classList.add('fade-out');
          setTimeout(() => {
            splash.style.display = 'none';
          }, 600);
        }, 2200);
      }
    }
    document.addEventListener('DOMContentLoaded', initSplash);
"""

if 'function initSplash()' not in content:
    content = content.replace('<script>', '<script>\n' + js_to_add)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Splash screen successfully applied to aoonjai-app.html")
