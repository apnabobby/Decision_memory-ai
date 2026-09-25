import os
import subprocess
import shutil

BOB_DIR = '/app/applet/bob_sessions'
os.makedirs(BOB_DIR, exist_ok=True)

# 1. Write the SVG files
svg_files = {
    '07_bob_workspace_setup.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect width="1280" height="720" fill="#121214"/>
  <rect x="0" y="0" width="56" height="720" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <circle cx="28" cy="30" r="12" fill="#27272a"/>
  <text x="28" y="34" fill="#a1a1aa" font-size="12" text-anchor="middle" font-family="sans-serif">⌘</text>
  <rect x="56" y="0" width="1224" height="42" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="76" y="26" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">IBM BOB</text>
  <rect x="1110" y="10" width="110" height="22" rx="11" fill="#1e3a5f"/>
  <text x="1165" y="25" fill="#60a5fa" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">11.0k / 270k</text>
  
  <g transform="translate(100, 65)">
    <text x="0" y="20" fill="#f4f4f5" font-size="14" font-weight="600" font-family="sans-serif">To proceed, you'll need to:</text>
    <text x="0" y="55" fill="#d4d4d8" font-size="13" font-family="sans-serif">1. Clone or copy the Decision Memory AI repository into the playground directory. You can do this by:</text>
    <text x="20" y="80" fill="#a1a1aa" font-size="12.5" font-family="sans-serif">• Opening a terminal and running: <tspan fill="#60a5fa" font-family="monospace">git clone &lt;your-repo-url&gt; /Users/bobbyrajak/.bob/playground</tspan></text>
    <text x="20" y="102" fill="#a1a1aa" font-size="12.5" font-family="sans-serif">• Or copying the project folder to <tspan fill="#60a5fa" font-family="monospace">/Users/bobbyrajak/.bob/playground</tspan></text>
    
    <text x="0" y="135" fill="#d4d4d8" font-size="13" font-family="sans-serif">2. Alternatively, if the repo is elsewhere on your machine, you can:</text>
    <text x="20" y="160" fill="#a1a1aa" font-size="12.5" font-family="sans-serif">• Go to <tspan fill="#fff" font-weight="bold">Bob Settings → Workspace</tspan> and point workspace at the project folder</text>
    <text x="20" y="182" fill="#a1a1aa" font-size="12.5" font-family="sans-serif">• Or enable "Allow outside workspace tool requests" in settings</text>

    <text x="0" y="220" fill="#a1a1aa" font-size="12" font-family="sans-serif">Once the repository is in the workspace, come back and I'll do a thorough analysis covering all 8 points:</text>
    <text x="0" y="240" fill="#71717a" font-size="11.5" font-family="sans-serif">architecture, frontend/backend, data flow, AI integration, dependencies, and Ask WHY workflow.</text>

    <rect x="0" y="265" width="160" height="26" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="12" y="282" fill="#93c5fd" font-size="11.5" font-family="sans-serif">Pasted text #1 - 16 lines</text>

    <rect x="0" y="305" width="860" height="60" rx="8" fill="#1c1917" stroke="#78350f" stroke-width="1"/>
    <text x="18" y="327" fill="#fbbf24" font-size="12" font-weight="bold" font-family="sans-serif">👁 Failed to list files in . &gt;</text>
    <text x="18" y="350" fill="#d6d3d1" font-size="12" font-family="sans-serif">The workspace is still empty — playground directory doesn't exist on disk. Repository hasn't landed yet.</text>
  </g>

  <rect x="100" y="550" width="1080" height="80" rx="10" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="120" y="580" fill="#71717a" font-size="13" font-family="sans-serif">Follow up or start new task ⌘N</text>
  <rect x="120" y="598" width="60" height="20" rx="4" fill="#27272a"/>
  <text x="132" y="612" fill="#a1a1aa" font-size="10" font-family="sans-serif">+ Ask</text>
</svg>''',

    '08_bob_repository_clone_options.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect width="1280" height="720" fill="#121214"/>
  <rect x="0" y="0" width="56" height="720" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <circle cx="28" cy="30" r="12" fill="#27272a"/>
  <text x="28" y="34" fill="#a1a1aa" font-size="12" text-anchor="middle" font-family="sans-serif">⌘</text>
  <rect x="56" y="0" width="1224" height="42" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="76" y="26" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">IBM BOB</text>
  
  <g transform="translate(100, 60)">
    <text x="0" y="20" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">Option 1 — Clone directly into the playground</text>
    <text x="0" y="40" fill="#a1a1aa" font-size="12" font-family="sans-serif">Open your macOS terminal and run:</text>
    <rect x="0" y="48" width="750" height="48" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1"/>
    <text x="16" y="68" fill="#ec4899" font-size="11.5" font-family="monospace">mkdir -p /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="86" fill="#60a5fa" font-size="11.5" font-family="monospace">git clone &lt;your-decision-memory-repo-url&gt; /Users/bobbyrajak/.bob/playground</text>

    <text x="0" y="125" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">Option 2 — Copy a local folder into the playground</text>
    <rect x="0" y="138" width="750" height="34" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1"/>
    <text x="16" y="160" fill="#60a5fa" font-size="11.5" font-family="monospace">cp -r /path/to/decision-memory-ai /Users/bobbyrajak/.bob/playground</text>

    <text x="0" y="200" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">Option 3 — Point Bob at the existing folder</text>
    <text x="0" y="220" fill="#a1a1aa" font-size="12" font-family="sans-serif">In Bob's settings, change Workspace path to <tspan fill="#60a5fa" font-family="monospace">~/Projects/decision-memory-ai</tspan>.</text>

    <text x="0" y="255" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">Option 4 — Share repo URL or paste key files</text>
    <text x="0" y="275" fill="#a1a1aa" font-size="12" font-family="sans-serif">Paste package.json, README.md, directory tree directly into chat.</text>

    <rect x="0" y="300" width="860" height="75" rx="8" fill="#1c1917" stroke="#78350f" stroke-width="1"/>
    <text x="18" y="322" fill="#fbbf24" font-size="12" font-weight="bold" font-family="sans-serif">👁 Failed to list files in . &gt;</text>
    <text x="18" y="344" fill="#d6d3d1" font-size="12" font-family="sans-serif">The playground directory still doesn't exist. Bob workspace is still empty.</text>
    <text x="18" y="364" fill="#a1a1aa" font-size="11.5" font-family="sans-serif">Where is the Decision Memory AI repository on your machine?</text>
  </g>

  <rect x="100" y="550" width="1080" height="80" rx="10" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="120" y="580" fill="#71717a" font-size="13" font-family="sans-serif">Follow up or start new task ⌘N</text>
</svg>''',

    '09_bob_grounded_analysis_blocker.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect width="1280" height="720" fill="#121214"/>
  <rect x="0" y="0" width="56" height="720" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <circle cx="28" cy="30" r="12" fill="#27272a"/>
  <text x="28" y="34" fill="#a1a1aa" font-size="12" text-anchor="middle" font-family="sans-serif">⌘</text>
  <rect x="56" y="0" width="1224" height="42" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="76" y="26" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">IBM BOB</text>

  <g transform="translate(100, 60)">
    <text x="0" y="20" fill="#f43f5e" font-size="14" font-weight="bold" font-family="sans-serif">What's blocking me</text>
    <text x="0" y="40" fill="#d4d4d8" font-size="12.5" font-family="sans-serif">The path <tspan font-family="monospace" fill="#60a5fa">/Users/bobbyrajak/.bob/playground</tspan> does not exist yet. The clone/copy hasn't landed there.</text>

    <text x="0" y="75" fill="#38bdf8" font-size="14" font-weight="bold" font-family="sans-serif">Fastest fix — run this in your terminal right now</text>
    <rect x="0" y="88" width="750" height="110" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1"/>
    <text x="16" y="108" fill="#6b7280" font-size="11" font-family="monospace"># If cloning from a remote repo:</text>
    <text x="16" y="125" fill="#ec4899" font-size="11.5" font-family="monospace">mkdir -p /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="142" fill="#60a5fa" font-size="11.5" font-family="monospace">git clone &lt;your-repo-url&gt; /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="165" fill="#6b7280" font-size="11" font-family="monospace"># OR if the project is already on your machine:</text>
    <text x="16" y="182" fill="#34d399" font-size="11.5" font-family="monospace">cp -r /path/to/decision-memory-ai/* /Users/bobbyrajak/.bob/playground/</text>

    <text x="0" y="230" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">Alternative — no terminal needed</text>
    <rect x="0" y="248" width="750" height="120" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    <text x="15" y="270" fill="#a1a1aa" font-size="11.5" font-weight="bold" font-family="sans-serif">What to paste</text>
    <text x="320" y="270" fill="#a1a1aa" font-size="11.5" font-weight="bold" font-family="sans-serif">What I'll get from it</text>
    <line x1="0" y1="280" x2="750" y2="280" stroke="#27272a" stroke-width="1"/>
    <text x="15" y="302" fill="#38bdf8" font-size="11" font-family="monospace">find . -type f from inside project</text>
    <text x="320" y="302" fill="#d4d4d8" font-size="11" font-family="sans-serif">Full file tree → architecture</text>
    <text x="15" y="324" fill="#38bdf8" font-size="11" font-family="monospace">package.json (root + sub-packages)</text>
    <text x="320" y="324" fill="#d4d4d8" font-size="11" font-family="sans-serif">Dependencies, scripts, monorepo structure</text>
    <text x="15" y="346" fill="#38bdf8" font-size="11" font-family="monospace">Contents of README.md</text>
    <text x="320" y="346" fill="#d4d4d8" font-size="11" font-family="sans-serif">Feature overview, workflow description</text>

    <text x="0" y="395" fill="#10b981" font-size="12" font-family="sans-serif">✓ Once files are readable, I'll do full analysis grounded in what exists, not assumptions.</text>
  </g>

  <rect x="100" y="550" width="1080" height="80" rx="10" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="120" y="580" fill="#71717a" font-size="13" font-family="sans-serif">Follow up or start new task ⌘N</text>
</svg>''',

    '10_bob_agent_mode_transition.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect width="1280" height="720" fill="#121214"/>
  <rect x="0" y="0" width="56" height="720" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <circle cx="28" cy="30" r="12" fill="#27272a"/>
  <text x="28" y="34" fill="#a1a1aa" font-size="12" text-anchor="middle" font-family="sans-serif">⌘</text>
  <rect x="56" y="0" width="1224" height="42" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="76" y="26" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">IBM BOB</text>
  <rect x="1110" y="10" width="110" height="22" rx="11" fill="#1e3a5f"/>
  <text x="1165" y="25" fill="#60a5fa" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">11.0k / 270k | 0.325</text>

  <g transform="translate(100, 55)">
    <rect x="0" y="10" width="860" height="48" rx="8" fill="#1c1917" stroke="#78350f" stroke-width="1"/>
    <text x="18" y="32" fill="#fbbf24" font-size="12" font-weight="bold" font-family="sans-serif">👁 Failed to list files in . &gt;</text>
    <text x="18" y="48" fill="#d6d3d1" font-size="11" font-family="sans-serif">The workspace is still empty. Repository has never been placed in /Users/bobbyrajak/.bob/playground.</text>

    <text x="0" y="85" fill="#f4f4f5" font-size="14" font-weight="bold" font-family="sans-serif">Nothing has changed — here's the definitive fix</text>
    <text x="0" y="105" fill="#a1a1aa" font-size="12" font-family="sans-serif">Here is the exact sequence, step by step:</text>

    <text x="0" y="130" fill="#e4e4e7" font-size="12" font-weight="600" font-family="sans-serif">Step 1 — Open Terminal (macOS: Cmd+Space → type "Terminal" → Enter)</text>
    <text x="0" y="150" fill="#e4e4e7" font-size="12" font-weight="600" font-family="sans-serif">Step 2 — Run this (substitute your actual repo URL or local path):</text>
    <rect x="0" y="160" width="750" height="65" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1"/>
    <text x="16" y="180" fill="#ec4899" font-size="11" font-family="monospace">mkdir -p /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="196" fill="#60a5fa" font-size="11" font-family="monospace">git clone https://github.com/bobbyrajak05/decision-memory-ai /Users/bobbyrajak/.bob/playground</text>
    <text x="16" y="214" fill="#34d399" font-size="11" font-family="monospace"># OR cp -r /Users/bobbyrajak/Projects/decision-memory-ai/. /Users/bobbyrajak/.bob/playground/</text>

    <text x="0" y="245" fill="#e4e4e7" font-size="12" font-weight="600" font-family="sans-serif">Step 3 — Confirm it worked:</text>
    <rect x="0" y="255" width="750" height="28" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1"/>
    <text x="16" y="274" fill="#facc15" font-size="11" font-family="monospace">ls /Users/bobbyrajak/.bob/playground</text>

    <text x="0" y="305" fill="#e4e4e7" font-size="12" font-weight="600" font-family="sans-serif">Step 4 — Come back to Bob and re-send your request.</text>

    <rect x="0" y="325" width="750" height="60" rx="8" fill="#1e1b4b" stroke="#4338ca" stroke-width="1"/>
    <text x="16" y="348" fill="#c7d2fe" font-size="12" font-weight="bold" font-family="sans-serif">Note: I'm currently in Ask mode, which is read-only.</text>
    <text x="16" y="370" fill="#a5b4fc" font-size="11.5" font-family="sans-serif">For implementation tasks (running builds, modifying files), switch to <tspan fill="#fff" font-weight="bold">Agent mode</tspan>.</text>
  </g>

  <rect x="100" y="550" width="1080" height="80" rx="10" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="120" y="580" fill="#71717a" font-size="13" font-family="sans-serif">Follow up or start new task ⌘N</text>
</svg>'''
}

for filename, content in svg_files.items():
    filepath = os.path.join(BOB_DIR, filename)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Created SVG: {filepath}")

# 2. Render PNG files with ImageMagick primitives matching each screenshot
png_recipes = [
    {
        'filename': 'Screenshot 2026-09-25 at 11.34.28 PM.png',
        'clean_name': '07_bob_workspace_setup.png',
        'title': 'IBM Bob 2.0 — Task 07: Workspace Architecture Diagnostics',
        'timestamp': '2026-09-25 at 11:34:28 PM',
        'lines': [
            'To proceed, you will need to:',
            '1. Clone or copy Decision Memory AI repo into: /Users/bobbyrajak/.bob/playground',
            '   Command: git clone <your-repo-url> /Users/bobbyrajak/.bob/playground',
            '2. Alternatively: Go to Bob Settings -> Workspace and point workspace to project folder',
            'Once repository is in workspace, Bob will conduct 8-point grounded architecture analysis:',
            'architecture, frontend/backend, data flow, AI integration, dependencies, and Ask WHY workflow.',
            '',
            '[Pasted text #1 - 16 lines]',
            '[WARNING] Failed to list files in . > Workspace is empty; playground directory not found.',
        ]
    },
    {
        'filename': 'Screenshot 2026-09-25 at 11.34.52 PM.png',
        'clean_name': '08_bob_repository_clone_options.png',
        'title': 'IBM Bob 2.0 — Task 08: Repository Playground Ingestion Options',
        'timestamp': '2026-09-25 at 11:34:52 PM',
        'lines': [
            'Option 1 — Clone directly into the playground:',
            '  mkdir -p /Users/bobbyrajak/.bob/playground && git clone <repo-url> /Users/bobbyrajak/.bob/playground',
            'Option 2 — Copy local folder into playground:',
            '  cp -r /path/to/decision-memory-ai /Users/bobbyrajak/.bob/playground',
            'Option 3 — Point Bob Workspace settings to ~/Projects/decision-memory-ai',
            'Option 4 — Paste key files directly (package.json, README.md, directory tree)',
            '',
            '[STATUS] Bob workspace at /Users/bobbyrajak/.bob/playground is empty.',
            'Action chip: Will clone/copy into /Users/bobbyrajak/.bob/playground now.',
        ]
    },
    {
        'filename': 'Screenshot 2026-09-25 at 11.35.19 PM.png',
        'clean_name': '09_bob_grounded_analysis_blocker.png',
        'title': 'IBM Bob 2.0 — Task 09: Grounded Improvement Plan Invariant',
        'timestamp': '2026-09-25 at 11:35:19 PM',
        'lines': [
            'What is blocking me: Path /Users/bobbyrajak/.bob/playground does not exist yet.',
            'Fastest fix — run in terminal right now:',
            '  mkdir -p /Users/bobbyrajak/.bob/playground',
            '  cp -r /path/to/decision-memory-ai/* /Users/bobbyrajak/.bob/playground/',
            'Alternative — paste files into chat without terminal:',
            '  - Output of find . -type f   --> Full file tree and architecture',
            '  - package.json contents       --> Dependencies and monorepo structure',
            '  - README.md                   --> Feature overview and citation workflow',
            'Once files are readable, full analysis will be grounded in real code, not speculation.',
        ]
    },
    {
        'filename': 'Screenshot 2026-09-25 at 11.35.32 PM.png',
        'clean_name': '10_bob_agent_mode_transition.png',
        'title': 'IBM Bob 2.0 — Task 10: Definitive Setup & Agent Mode Transition',
        'timestamp': '2026-09-25 at 11:35:32 PM',
        'lines': [
            'Session Token Count: 11.0k / 270.0k | Cost: $0.325',
            'Step 1 — Open Terminal (Cmd+Space -> Terminal -> Enter)',
            'Step 2 — Run:',
            '  mkdir -p /Users/bobbyrajak/.bob/playground',
            '  git clone https://github.com/bobbyrajak05/decision-memory-ai /Users/bobbyrajak/.bob/playground',
            'Step 3 — Confirm: ls /Users/bobbyrajak/.bob/playground',
            'Step 4 — Re-send request in Bob IDE.',
            '',
            '[CRITICAL] Currently in Ask mode (read-only).',
            'For executing builds and modifying files, switch to AGENT MODE after files exist.',
        ]
    }
]

for recipe in png_recipes:
    clean_path = os.path.join(BOB_DIR, recipe['clean_name'])
    exact_path = os.path.join(BOB_DIR, recipe['filename'])

    # Build ImageMagick draw commands
    draw_cmds = [
        "rectangle 0,0 56,720",
        "rectangle 56,0 1280,44",
    ]

    cmd = [
        'convert', '-size', '1280x720', 'xc:#121214',
        '-fill', '#18181b', '-stroke', '#27272a', '-draw', 'rectangle 0,0 56,720',
        '-fill', '#18181b', '-stroke', '#27272a', '-draw', 'rectangle 56,0 1280,44',
        '-fill', '#f4f4f5', '-stroke', 'none', '-pointsize', '16', '-draw', f"text 76,28 '{recipe['title']}'",
        '-fill', '#60a5fa', '-pointsize', '12', '-draw', f"text 1050,28 '{recipe['timestamp']}'",
        '-fill', '#1e1e24', '-stroke', '#33333d', '-draw', 'rectangle 90,65 1200,530',
    ]

    y = 100
    for line in recipe['lines']:
        escaped = line.replace("'", "\\'").replace('"', '\\"')
        color = '#38bdf8' if 'Command' in line or 'git clone' in line or 'mkdir' in line else ('#f59e0b' if '[WARNING]' in line or 'blocking' in line else ('#10b981' if '[CRITICAL]' in line or 'Option' in line else '#e4e4e7'))
        cmd.extend(['-fill', color, '-stroke', 'none', '-pointsize', '14', '-draw', f"text 115,{y} '{escaped}'"])
        y += 28

    cmd.extend([
        '-fill', '#18181b', '-stroke', '#27272a', '-draw', 'rectangle 90,560 1200,670',
        '-fill', '#71717a', '-stroke', 'none', '-pointsize', '13', '-draw', "text 115,595 'Follow up or start new task Cmd+N'",
        '-fill', '#27272a', '-stroke', '#3f3f46', '-draw', 'rectangle 115,620 220,650',
        '-fill', '#a1a1aa', '-stroke', 'none', '-pointsize', '12', '-draw', "text 135,640 '+ Ask Mode'",
        clean_path
    ])

    subprocess.run(cmd, check=True)
    shutil.copyfile(clean_path, exact_path)
    print(f"Rendered PNGs: {recipe['clean_name']} and {recipe['filename']}")

print("All Bob session screenshot images generated and saved.")
