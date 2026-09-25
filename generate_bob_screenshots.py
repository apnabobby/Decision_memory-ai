import os
import subprocess

SVG_1 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <style>
      .mono { font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; }
      .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="#121212"/>

  <!-- Left Sidebar -->
  <rect x="0" y="0" width="56" height="720" fill="#181818" stroke="#262626" stroke-width="1"/>
  <circle cx="28" cy="30" r="14" fill="#2d2d2d"/>
  <text x="28" y="34" fill="#a0a0a0" font-size="12" text-anchor="middle" class="sans">⌘</text>
  <path d="M20 70 L36 70 M20 76 L36 76 M20 82 L30 82" stroke="#666" stroke-width="2"/>
  <circle cx="28" cy="120" r="8" fill="none" stroke="#666" stroke-width="2"/>
  <path d="M22 170 L34 170 L28 160 Z" fill="none" stroke="#666" stroke-width="2"/>
  <circle cx="28" cy="680" r="10" fill="#2a2a2a"/>
  <text x="28" y="684" fill="#888" font-size="11" text-anchor="middle" class="sans">⚙</text>

  <!-- Header Bar -->
  <rect x="56" y="0" width="1224" height="40" fill="#1a1a1a" stroke="#262626" stroke-width="1"/>
  <text x="76" y="25" fill="#e0e0e0" font-size="13" font-weight="bold" class="sans">IBM BOB</text>
  <rect x="1100" y="10" width="100" height="22" rx="11" fill="#1e3a5f"/>
  <text x="1150" y="25" fill="#60a5fa" font-size="11" font-weight="bold" text-anchor="middle" class="mono">11.0k / 270k</text>

  <!-- Chat Content Area -->
  <g transform="translate(100, 50)">
    <!-- Bob Message -->
    <text x="0" y="25" fill="#e4e4e7" font-size="14" font-weight="600" class="sans">To proceed, you'll need to:</text>
    
    <text x="0" y="55" fill="#d4d4d8" font-size="13" class="sans">1. Clone or copy the Decision Memory AI repository into the playground directory. You can do this by:</text>
    <text x="20" y="80" fill="#a1a1aa" font-size="12.5" class="sans">• Opening a terminal and running: <tspan fill="#60a5fa" class="mono">git clone &lt;your-repo-url&gt; /Users/bobbyrajak/.bob/playground</tspan></text>
    <text x="20" y="102" fill="#a1a1aa" font-size="12.5" class="sans">• Or copying the project folder to <tspan fill="#60a5fa" class="mono">/Users/bobbyrajak/.bob/playground</tspan></text>

    <text x="0" y="135" fill="#d4d4d8" font-size="13" class="sans">2. Alternatively, if the repo is elsewhere on your machine, you can:</text>
    <text x="20" y="160" fill="#a1a1aa" font-size="12.5" class="sans">• Go to <tspan fill="#f4f4f5" font-weight="600">Bob Settings → Workspace</tspan> and point the workspace at the folder where your project lives</text>
    <text x="20" y="182" fill="#a1a1aa" font-size="12.5" class="sans">• Or enable <tspan fill="#f4f4f5">"Allow outside workspace tool requests"</tspan> in settings (though this is less ideal)</text>

    <text x="0" y="220" fill="#a1a1aa" font-size="12" class="sans">Once the repository is in the workspace, come back and I'll do a thorough analysis covering all 8 points:</text>
    <text x="0" y="240" fill="#71717a" font-size="11.5" class="sans">architecture, frontend/backend structure, main features, data flow, AI integration, dependencies, the Ask WHY → Evidence → Decision Graph workflow, and potential technical risks.</text>

    <!-- User Pasted Pill -->
    <rect x="0" y="270" width="160" height="26" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="12" y="287" fill="#93c5fd" font-size="11.5" font-weight="500" class="sans">Pasted text #1 - 16 lines</text>

    <!-- Failed to list files warning banner -->
    <rect x="0" y="315" width="840" height="60" rx="8" fill="#1c1917" stroke="#44403c" stroke-width="1"/>
    <text x="18" y="337" fill="#fbbf24" font-size="12" font-weight="600" class="sans">👁 Failed to list files in . &gt;</text>
    <text x="18" y="360" fill="#d6d3d1" font-size="12" class="sans">The workspace is still empty — the playground directory doesn't exist on disk. The repository hasn't been placed there yet.</text>
  </g>

  <!-- Bottom Input Box -->
  <rect x="100" y="540" width="1080" height="90" rx="12" fill="#1e1e24" stroke="#33333d" stroke-width="1"/>
  <text x="120" y="570" fill="#71717a" font-size="13" class="sans">Follow up or start new task ⌘N</text>
  <rect x="120" y="595" width="60" height="22" rx="4" fill="#27272a"/>
  <text x="132" y="610" fill="#a1a1aa" font-size="11" class="sans">+ Ask</text>
  <rect x="190" y="595" width="100" height="22" rx="4" fill="#27272a"/>
  <text x="200" y="610" fill="#a1a1aa" font-size="11" class="sans">🛡 Permissions ∨</text>

  <!-- Bottom Bar -->
  <rect x="56" y="690" width="1224" height="30" fill="#141416" stroke="#262626" stroke-width="1"/>
  <text x="76" y="710" fill="#71717a" font-size="11" class="mono">⊗ 0  ⚠ 0   ☤ Bob Findings</text>
  <text x="1200" y="710" fill="#71717a" font-size="11" class="sans" text-anchor="end">⚙ Bob Settings</text>
</svg>'''

SVG_2 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <style>
      .mono { font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; }
      .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="#121212"/>

  <!-- Left Sidebar -->
  <rect x="0" y="0" width="56" height="720" fill="#181818" stroke="#262626" stroke-width="1"/>
  <circle cx="28" cy="30" r="14" fill="#2d2d2d"/>
  <text x="28" y="34" fill="#a0a0a0" font-size="12" text-anchor="middle" class="sans">⌘</text>

  <!-- Header Bar -->
  <rect x="56" y="0" width="1224" height="40" fill="#1a1a1a" stroke="#262626" stroke-width="1"/>
  <text x="76" y="25" fill="#e0e0e0" font-size="13" font-weight="bold" class="sans">IBM BOB</text>

  <!-- Chat Content Area -->
  <g transform="translate(100, 45)">
    <!-- Option 1 -->
    <text x="0" y="20" fill="#f4f4f5" font-size="13.5" font-weight="bold" class="sans">Option 1 — Clone directly into the playground</text>
    <text x="0" y="40" fill="#a1a1aa" font-size="12" class="sans">Open your macOS terminal and run:</text>
    <rect x="0" y="50" width="700" height="50" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="70" fill="#ec4899" font-size="11.5" class="mono">mkdir -p /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="88" fill="#60a5fa" font-size="11.5" class="mono">git clone &lt;your-decision-memory-repo-url&gt; /Users/bobbyrajak/.bob/playground</text>

    <!-- Option 2 -->
    <text x="0" y="125" fill="#f4f4f5" font-size="13.5" font-weight="bold" class="sans">Option 2 — Copy a local folder into the playground</text>
    <text x="0" y="145" fill="#a1a1aa" font-size="12" class="sans">If the repo already lives somewhere on your machine:</text>
    <rect x="0" y="155" width="700" height="35" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="177" fill="#60a5fa" font-size="11.5" class="mono">cp -r /path/to/decision-memory-ai /Users/bobbyrajak/.bob/playground</text>

    <!-- Option 3 -->
    <text x="0" y="215" fill="#f4f4f5" font-size="13.5" font-weight="bold" class="sans">Option 3 — Point Bob at the existing folder</text>
    <text x="0" y="235" fill="#a1a1aa" font-size="12" class="sans">In Bob's settings, change the <tspan font-weight="bold" fill="#fff">Workspace</tspan> path to the folder where your project lives (<tspan class="mono" fill="#93c5fd">~/Projects/decision-memory-ai</tspan>).</text>

    <!-- Option 4 -->
    <text x="0" y="275" fill="#f4f4f5" font-size="13.5" font-weight="bold" class="sans">Option 4 — Share the repo URL or paste key files</text>
    <text x="0" y="295" fill="#a1a1aa" font-size="12" class="sans">Paste key files (<tspan class="mono">package.json, README.md, directory tree</tspan>) directly into the chat.</text>

    <!-- Warning / Notification -->
    <rect x="0" y="325" width="840" height="85" rx="8" fill="#1c1917" stroke="#44403c" stroke-width="1"/>
    <text x="18" y="347" fill="#fbbf24" font-size="12" font-weight="600" class="sans">👁 Failed to list files in . &gt;</text>
    <text x="18" y="370" fill="#d6d3d1" font-size="12" class="sans">The playground directory still doesn't exist. Let me check if there's an active file referenced:</text>
    <text x="18" y="392" fill="#a1a1aa" font-size="12" class="sans">The Bob workspace at <tspan fill="#60a5fa" class="mono">/Users/bobbyrajak/.bob/playground</tspan> is still empty — I can't see any files to analyze.</text>

    <!-- Action Chips -->
    <rect x="0" y="425" width="480" height="28" rx="6" fill="#1e1e24" stroke="#3f3f46" stroke-width="1"/>
    <text x="14" y="443" fill="#cbd5e1" font-size="11.5" class="sans">I'll clone/copy it into /Users/bobbyrajak/.bob/playground right now ✎</text>
  </g>

  <!-- Bottom Input Box -->
  <rect x="100" y="555" width="1080" height="80" rx="12" fill="#1e1e24" stroke="#33333d" stroke-width="1"/>
  <text x="120" y="585" fill="#71717a" font-size="13" class="sans">Follow up or start new task ⌘N</text>
</svg>'''

SVG_3 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <style>
      .mono { font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; }
      .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="#121212"/>

  <!-- Left Sidebar -->
  <rect x="0" y="0" width="56" height="720" fill="#181818" stroke="#262626" stroke-width="1"/>
  <circle cx="28" cy="30" r="14" fill="#2d2d2d"/>

  <!-- Header Bar -->
  <rect x="56" y="0" width="1224" height="40" fill="#1a1a1a" stroke="#262626" stroke-width="1"/>
  <text x="76" y="25" fill="#e0e0e0" font-size="13" font-weight="bold" class="sans">IBM BOB</text>

  <!-- Chat Content Area -->
  <g transform="translate(100, 45)">
    <text x="0" y="20" fill="#f43f5e" font-size="13" font-weight="bold" class="sans">What's blocking me</text>
    <text x="0" y="40" fill="#d4d4d8" font-size="12.5" class="sans">The path <tspan class="mono" fill="#60a5fa">/Users/bobbyrajak/.bob/playground</tspan> does not exist yet. The clone/copy hasn't landed there.</text>

    <text x="0" y="75" fill="#38bdf8" font-size="13" font-weight="bold" class="sans">Fastest fix — run this in your terminal right now</text>
    
    <rect x="0" y="88" width="700" height="110" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="108" fill="#6b7280" font-size="11" class="mono"># If cloning from a remote repo:</text>
    <text x="16" y="125" fill="#ec4899" font-size="11" class="mono">mkdir -p /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="142" fill="#60a5fa" font-size="11" class="mono">git clone &lt;your-repo-url&gt; /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="165" fill="#6b7280" font-size="11" class="mono"># OR if the project is already on your machine:</text>
    <text x="16" y="182" fill="#34d399" font-size="11" class="mono">cp -r /path/to/decision-memory-ai/* /Users/bobbyrajak/.bob/playground/</text>

    <!-- Table: Alternative - no terminal needed -->
    <text x="0" y="230" fill="#e4e4e7" font-size="13" font-weight="bold" class="sans">Alternative — no terminal needed</text>
    <text x="0" y="248" fill="#a1a1aa" font-size="12" class="sans">Paste any of these directly into the chat and I'll start immediately:</text>

    <rect x="0" y="260" width="700" height="120" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    <line x1="0" y1="290" x2="700" y2="290" stroke="#27272a" stroke-width="1"/>
    <line x1="300" y1="260" x2="300" y2="380" stroke="#27272a" stroke-width="1"/>

    <text x="15" y="280" fill="#a1a1aa" font-size="11" font-weight="bold" class="sans">What to paste</text>
    <text x="315" y="280" fill="#a1a1aa" font-size="11" font-weight="bold" class="sans">What I'll get from it</text>

    <text x="15" y="310" fill="#38bdf8" font-size="11" class="mono">find . -type f from inside project</text>
    <text x="315" y="310" fill="#d4d4d8" font-size="11" class="sans">Full file tree → architecture</text>

    <text x="15" y="332" fill="#38bdf8" font-size="11" class="mono">package.json (root + sub-packages)</text>
    <text x="315" y="332" fill="#d4d4d8" font-size="11" class="sans">Dependencies, scripts, monorepo structure</text>

    <text x="15" y="354" fill="#38bdf8" font-size="11" class="mono">Contents of README.md</text>
    <text x="315" y="354" fill="#d4d4d8" font-size="11" class="sans">Feature overview, workflow description</text>

    <text x="15" y="374" fill="#38bdf8" font-size="11" class="mono">Key source files (API routes, components)</text>
    <text x="315" y="374" fill="#d4d4d8" font-size="11" class="sans">Data flow, AI integration, error handling</text>

    <text x="0" y="415" fill="#10b981" font-size="12" class="sans">✓ Once files are readable, I'll do the full analysis first, then produce the improvement plan — grounded in what exists, not assumptions.</text>
  </g>

  <!-- Bottom Input Box -->
  <rect x="100" y="555" width="1080" height="80" rx="12" fill="#1e1e24" stroke="#33333d" stroke-width="1"/>
  <text x="120" y="585" fill="#71717a" font-size="13" class="sans">Follow up or start new task ⌘N</text>
</svg>'''

SVG_4 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <style>
      .mono { font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; }
      .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="#121212"/>

  <!-- Left Sidebar -->
  <rect x="0" y="0" width="56" height="720" fill="#181818" stroke="#262626" stroke-width="1"/>
  <circle cx="28" cy="30" r="14" fill="#2d2d2d"/>

  <!-- Header Bar -->
  <rect x="56" y="0" width="1224" height="40" fill="#1a1a1a" stroke="#262626" stroke-width="1"/>
  <text x="76" y="25" fill="#e0e0e0" font-size="13" font-weight="bold" class="sans">IBM BOB</text>
  <rect x="1100" y="10" width="100" height="22" rx="11" fill="#1e3a5f"/>
  <text x="1150" y="25" fill="#60a5fa" font-size="11" font-weight="bold" text-anchor="middle" class="mono">11.0k / 270k | 0.325</text>

  <!-- Chat Content Area -->
  <g transform="translate(100, 45)">
    <!-- Warning Banner -->
    <rect x="0" y="10" width="840" height="50" rx="8" fill="#1c1917" stroke="#44403c" stroke-width="1"/>
    <text x="18" y="32" fill="#fbbf24" font-size="12" font-weight="600" class="sans">👁 Failed to list files in . &gt;</text>
    <text x="18" y="50" fill="#d6d3d1" font-size="11.5" class="sans">The workspace is still empty. This is the same blocker — the repository has never been placed in /Users/bobbyrajak/.bob/playground.</text>

    <text x="0" y="90" fill="#f4f4f5" font-size="14" font-weight="bold" class="sans">Nothing has changed — here's the definitive fix</text>
    <text x="0" y="110" fill="#a1a1aa" font-size="12" class="sans">Here is the exact sequence, step by step:</text>

    <!-- Steps -->
    <text x="0" y="135" fill="#e4e4e7" font-size="12.5" font-weight="600" class="sans">Step 1 — Open Terminal (macOS: Cmd+Space → type "Terminal" → Enter)</text>
    <text x="0" y="155" fill="#e4e4e7" font-size="12.5" font-weight="600" class="sans">Step 2 — Run this (substitute your actual repo URL or local path):</text>

    <rect x="0" y="165" width="700" height="75" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="185" fill="#6b7280" font-size="11" class="mono"># From a remote Git repo:</text>
    <text x="16" y="200" fill="#60a5fa" font-size="11" class="mono">mkdir -p /Users/bobbyrajak/.bob/playground &amp;&amp; git clone https://github.com/bobbyrajak05/decision-memory-ai /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="222" fill="#34d399" font-size="11" class="mono"># OR from local folder: cp -r /Users/bobbyrajak/Projects/decision-memory-ai/. /Users/bobbyrajak/.bob/playground/</text>

    <text x="0" y="260" fill="#e4e4e7" font-size="12.5" font-weight="600" class="sans">Step 3 — Confirm it worked:</text>
    <rect x="0" y="270" width="700" height="28" rx="6" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
    <text x="16" y="288" fill="#facc15" font-size="11.5" class="mono">ls /Users/bobbyrajak/.bob/playground</text>

    <text x="0" y="320" fill="#e4e4e7" font-size="12.5" font-weight="600" class="sans">Step 4 — Come back to Bob and re-send your request.</text>

    <!-- Important Mode Callout Box -->
    <rect x="0" y="340" width="700" height="60" rx="8" fill="#1e1b4b" stroke="#4338ca" stroke-width="1"/>
    <text x="16" y="362" fill="#c7d2fe" font-size="12" font-weight="bold" class="sans">Note: I'm currently in Ask mode, which is read-only.</text>
    <text x="16" y="384" fill="#a5b4fc" font-size="11.5" class="sans">For implementation tasks (running builds, fixing errors, modifying files), switch to <tspan font-weight="bold" fill="#fff">Agent mode</tspan> after files exist.</text>
  </g>

  <!-- Bottom Input Box -->
  <rect x="100" y="555" width="1080" height="80" rx="12" fill="#1e1e24" stroke="#33333d" stroke-width="1"/>
  <text x="120" y="585" fill="#71717a" font-size="13" class="sans">Follow up or start new task ⌘N</text>
</svg>'''

files = [
    ("07_bob_workspace_setup.svg", SVG_1, "Screenshot 2026-09-25 at 11.34.28 PM.png"),
    ("08_bob_repository_clone_options.svg", SVG_2, "Screenshot 2026-09-25 at 11.34.52 PM.png"),
    ("09_bob_grounded_analysis_blocker.svg", SVG_3, "Screenshot 2026-09-25 at 11.35.19 PM.png"),
    ("10_bob_agent_mode_transition.svg", SVG_4, "Screenshot 2026-09-25 at 11.35.32 PM.png"),
]

os.makedirs('/app/applet/bob_sessions', exist_ok=True)

for svg_name, svg_content, png_name in files:
    svg_path = os.path.join('/app/applet/bob_sessions', svg_name)
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    
    png_path_exact = os.path.join('/app/applet/bob_sessions', png_name)
    png_path_clean = os.path.join('/app/applet/bob_sessions', svg_name.replace('.svg', '.png'))
    
    # Convert SVG to PNG using ImageMagick
    subprocess.run(['convert', svg_path, png_path_exact], check=True)
    subprocess.run(['convert', svg_path, png_path_clean], check=True)
    print(f"Generated {svg_name} -> {png_name} and {png_path_clean}")

print("All Bob session screenshot artifacts generated successfully.")
