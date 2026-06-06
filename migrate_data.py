import os
import re
import json

base_dir = "f:/Codes/Projects/madhu_portfolio"
services_dir = os.path.join(base_dir, "src/app/(portfolio)/services")
case_studies_dir = os.path.join(base_dir, "src/app/(portfolio)/case-studies")
data_path = os.path.join(base_dir, "Data/portfolio-content.json")

def extract_array(text, array_name):
    # Matches `const arrayName = [ ... ];`
    pattern = rf'const\s+{array_name}\s*=\s*(\[[^\]]*\]);'
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return []
    
    array_str = match.group(1)
    # The array_str contains JS objects like { label: "Project", val: "Udemy Enroller" }
    # We need to parse this into Python dicts. Since it's not strictly JSON, we'll use a hack to evaluate it.
    import ast
    # replace unquoted keys with quoted keys
    # Note: this simple regex works for simple keys
    json_str = re.sub(r'(?<!")\b([a-zA-Z_]\w*)\s*:', r'"\1":', array_str)
    # replace `"` inside strings? no, we can just use ast.literal_eval if we make it Python syntax
    # Actually, Python ast.literal_eval doesn't support true/false/null directly unless mapped.
    # JSON loads is better if we clean it up
    json_str = json_str.replace('\n', '').strip()
    # remove trailing commas
    json_str = re.sub(r',\s*\]', ']', json_str)
    json_str = re.sub(r',\s*\}', '}', json_str)
    
    try:
        return json.loads(json_str)
    except Exception as e:
        print(f"Failed to parse {array_name}: {e}")
        # fallback to regex extraction
        if array_name == 'faqs':
            # Extract {q: "...", a: "..."}
            items = []
            for m in re.finditer(r'\{[^}]*?q:\s*"(.*?)",[^}]*?a:\s*"(.*?)"[^}]*?\}', array_str, re.DOTALL):
                items.append({'question': m.group(1), 'answer': m.group(2)})
            return items
        
        return []

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for service in data.get("services", []):
    slug = service["slug"]
    page_path = os.path.join(services_dir, slug, "page.tsx")
    if os.path.exists(page_path):
        with open(page_path, 'r', encoding='utf-8') as f:
            text = f.read()
            # We want to extract audience, problemsSolved, capabilityCards, techStackGroups, faqs, deliverables
            # audience: const whoThisIsFor = [ ... ]
            whoThisIsFor = extract_array(text, "whoThisIsFor")
            if whoThisIsFor: service["audience"] = whoThisIsFor
            
            problemsSolved = extract_array(text, "problemsSolved")
            if problemsSolved: service["problemsSolved"] = problemsSolved
            
            # ... and so on ... (I will implement this properly next)
