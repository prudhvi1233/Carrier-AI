import os
import re

d = r'c:\Users\USER\Desktop\summer_project\ai-resume-checker\src'
for root, dirs, files in os.walk(d):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            content = re.sub(r'\bbg-white/5\b', 'bg-overlay', content)
            content = re.sub(r'\bbg-white/10\b', 'bg-overlay-hover', content)
            content = re.sub(r'\bborder-white/10\b', 'border-border', content)
            content = re.sub(r'\bborder-white/5\b', 'border-border', content)
            content = re.sub(r'\btext-gray-400\b', 'text-muted', content)
            content = re.sub(r'\btext-gray-300\b', 'text-muted', content)
            content = re.sub(r'\btext-white\b', 'text-foreground', content)
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
