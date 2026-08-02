import os
import re

directory = r'c:\Users\USER\Desktop\summer_project\ai-resume-checker\src'

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not content.strip():
            return # skip empty files

        # Replace standard dark mode hardcoded values with variables
        content = re.sub(r'\bbg-white/5\b', 'bg-overlay', content)
        content = re.sub(r'\bbg-white/10\b', 'bg-overlay-hover', content)
        content = re.sub(r'\bborder-white/10\b', 'border-border', content)
        content = re.sub(r'\bborder-white/5\b', 'border-border', content)
        content = re.sub(r'\btext-gray-400\b', 'text-muted', content)
        content = re.sub(r'\btext-gray-300\b', 'text-muted', content)
        content = re.sub(r'\btext-white\b', 'text-foreground', content)
        
        # Replace the bg-black/20 which looks like solid gray in light mode
        content = re.sub(r'\bbg-black/20\b', 'bg-overlay', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.jsx'):
            process_file(os.path.join(root, filename))

print("Safe refactoring complete.")
