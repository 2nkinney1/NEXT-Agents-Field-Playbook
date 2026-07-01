#!/usr/bin/env python3
"""
patch-seed.py
Usage: python3 patch-seed.py <exported-playbook.json>

Takes a JSON file exported from the Manage Content page and writes the
content back into seed-data.js so every browser sees it on first load.

What gets updated:
  COB          <- export.cob        (strips runtime IDs from policy entries)
  OBJECTIONS   <- export.objections (strips id / deck fields)
  VERTICALS    <- export.verticals  (strips id / deck; strips per-product ids)
  RESOURCES    <- export.resources  (strips id / section)
  SECTIONS     <- export.sections
  RES_SECTIONS <- export.resSections
  SETTINGS     (toolName, toolTagline, banner) <- export.settings
"""

import sys, json, re, shutil
from pathlib import Path

# ── args ──────────────────────────────────────────────────────────────────
if len(sys.argv) < 2:
    print("Usage: python3 patch-seed.py <exported-playbook.json>")
    sys.exit(1)

import_path = Path(sys.argv[1])
seed_path  = Path(__file__).parent / "seed-data.js"

if not import_path.exists():
    print(f"File not found: {import_path}"); sys.exit(1)
if not seed_path.exists():
    print(f"seed-data.js not found at {seed_path}"); sys.exit(1)

# ── load export ───────────────────────────────────────────────────────────
try:
    imp = json.loads(import_path.read_text(encoding="utf-8"))
except Exception as e:
    print(f"Could not parse JSON: {e}"); sys.exit(1)

for key in ("cob", "objections", "verticals", "resources"):
    if key not in imp:
        print(f"Missing key '{key}' — this doesn't look like a Playbook export.")
        sys.exit(1)

# ── strip runtime-only fields ─────────────────────────────────────────────
def strip_keys(item, keys):
    return {k: v for k, v in item.items() if k not in keys}

def strip_cob(cob_arr):
    out = []
    for c in cob_arr:
        clean = dict(c)
        if "policies" in clean:
            clean["policies"] = {
                tier: [strip_keys(p, {"id"}) for p in clean["policies"].get(tier, [])]
                for tier in ("must", "rec", "opt")
            }
        out.append(clean)
    return out

def strip_list(arr, remove):
    out = []
    for item in arr:
        clean = strip_keys(item, remove)
        if "products" in clean:
            clean["products"] = [strip_keys(p, {"id"}) for p in clean["products"]]
        out.append(clean)
    return out

new_cob         = strip_cob(imp["cob"])
new_objections  = strip_list(imp["objections"],  {"id", "deck"})
new_verticals   = strip_list(imp["verticals"],   {"id", "deck"})
new_resources   = strip_list(imp["resources"],   {"id"})
new_sections    = imp.get("sections",    [])
new_res_sections = imp.get("resSections", [])
new_settings    = imp.get("settings",   {})

# ── bracket-walking replacer ──────────────────────────────────────────────
def replace_array_const(src: str, name: str, new_array: list) -> str:
    """Replace `  const NAME = [ ... ];` using a bracket-depth walker."""
    marker = f"  const {name} = ["
    start = src.find(marker)
    if start == -1:
        raise ValueError(f'Could not find "const {name} = [" in seed-data.js')

    # walk from the opening [ to the matching ]
    depth = 0
    i = start + len(marker) - 1  # points at the opening [
    while i < len(src):
        if src[i] == "[":
            depth += 1
        elif src[i] == "]":
            depth -= 1
            if depth == 0:
                break
        i += 1

    end = i + 1
    if end < len(src) and src[end] == ";":
        end += 1

    serialized = json.dumps(new_array, indent=4, ensure_ascii=False)
    # indent every line by 2 spaces to match the IIFE scope, except first line
    lines = serialized.splitlines()
    indented = lines[0] + "\n" + "\n".join("  " + ln for ln in lines[1:])

    return src[:start] + f"  const {name} = " + indented + ";" + src[end:]

def replace_settings_keys(src: str, settings: dict) -> str:
    """Patch toolName, toolTagline, and banner inside the SETTINGS literal."""
    out = src

    def replace_scalar(s, key, value):
        pattern = rf'(\s+{re.escape(key)}:\s*)("[^"]*"|\'[^\']*\'|true|false|\d+)(,?)'
        repl = lambda m: m.group(1) + json.dumps(value) + m.group(3)
        return re.sub(pattern, repl, s, count=1)

    if "toolName" in settings:
        out = replace_scalar(out, "toolName", settings["toolName"])
    if "toolTagline" in settings:
        out = replace_scalar(out, "toolTagline", settings["toolTagline"])

    if "banner" in settings:
        b = settings["banner"]
        banner_re = re.compile(r'(banner:\s*\{)[^}]*(\})', re.DOTALL)
        replacement = (
            f'$1 on: {json.dumps(b.get("on", False))}, '
            f'tone: {json.dumps(b.get("tone", "info"))}, '
            f'text: {json.dumps(b.get("text", ""))} $2'
        )
        # use a function to avoid backreference issues with the replacement string
        def banner_sub(m):
            return (
                f'{m.group(1)} on: {json.dumps(b.get("on", False))}, '
                f'tone: {json.dumps(b.get("tone", "info"))}, '
                f'text: {json.dumps(b.get("text", ""))} {m.group(2)}'
            )
        out = banner_re.sub(banner_sub, out, count=1)

    return out

# ── apply patches ─────────────────────────────────────────────────────────
src = seed_path.read_text(encoding="utf-8")

try:
    src = replace_array_const(src, "COB",          new_cob)
    src = replace_array_const(src, "OBJECTIONS",   new_objections)
    src = replace_array_const(src, "VERTICALS",    new_verticals)
    src = replace_array_const(src, "RESOURCES",    new_resources)
    src = replace_array_const(src, "SECTIONS",     new_sections)
    src = replace_array_const(src, "RES_SECTIONS", new_res_sections)
    src = replace_settings_keys(src, new_settings)
except ValueError as e:
    print(f"Patch failed: {e}"); sys.exit(1)

# ── backup and save ───────────────────────────────────────────────────────
backup_path = seed_path.with_suffix(".js.bak")
shutil.copy2(seed_path, backup_path)
print(f"Backup saved to {backup_path.name}")

seed_path.write_text(src, encoding="utf-8")
print("seed-data.js updated successfully.")
print(f"  COB classes:   {len(new_cob)}")
print(f"  Objections:    {len(new_objections)}")
print(f"  Verticals:     {len(new_verticals)}")
print(f"  Resources:     {len(new_resources)}")
print(f"  Sections:      {len(new_sections)}")
print(f"  Res sections:  {len(new_res_sections)}")
