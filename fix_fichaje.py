import re

# Read the original file to get the exact content structure
with open('app/(main)/fichaje/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The key changes we need to make:
# 1. Remove the useEffect that resets state when dni.length === 0
# 2. Move handleClear before handleFichar
# 3. Convert handleFichar to useCallback and add to handleSearch deps

# Remove the useEffect block (lines 109-115 approximately)
content = re.sub(
    r'\n\s*useEffect\(\(\) => \{\n\s*if \(dni\.length === 0\) \{\n\s*setShowCard\(false\);\n\s*setNotFound\(false\);\n\s*setJustFichado\(false\);\n\s*\}\n\s*\}, \[dni\]\);',
    '',
    content
)

# Reorder: handleClear should come before handleFichar
# Find handleClear and handleFichar blocks and swap them

# First, let's extract the functions
pattern = r'(const handleClear = useCallback\(\(\) => \{[\s\S]*?\n  \}\);)\s*(const handleFichar = .*?)\s*(const handleKeyPress = useCallback)'

match = re.search(pattern, content)
if match:
    handle_clear = match.group(1)
    handle_fichar = match.group(2)
    handle_keypress_start = match.group(3)
    
    # Reconstruct with handleClear before handleFichar
    # Remove the old handleClear and handleFichar
    content = re.sub(pattern, '', content)
    
    # Find where to insert (before handleKeyPress)
    content = content.replace(
        'const handleKeyPress = useCallback',
        handle_clear + '\n\n  ' + handle_fichar + '\n\n  ' + handle_keypress_start
    )

# Convert handleFichar to useCallback - it's currently a regular async function
content = re.sub(
    r'const handleFichar = async \(socioId\?\: string\) =>',
    r'const handleFichar = useCallback(async (socioId?: string) =>',
    content
)

# Add closing parenthesis and dependencies to handleFichar (before handleKeyPress)
# We need to find the end of handleFichar and add the deps
# The pattern is: handleFichar function body ends with }; and then handleKeyPress starts
content = re.sub(
    r'(setJustFichado\(true\);\s*\}\s*setTimeout\(\(\) => \{\s*handleClear\(\);\s*\}, 2500\);\s*\}\s*catch \(err\) \{\s*console\.error\("Error al fichar:", err\);\s*\}\s*\});)([\s\n]*const handleKeyPress)',
    r'\1, [socio?.id, createFichaje, handleClear])\2',
    content
)

# Also need to add useCallback import is already there - no change needed

# Add handleFichar to handleSearch dependencies
content = re.sub(
    r'(\}, \[dni, refetch\]\);)',
    r', handleFichar\1',
    content
)

# Write the modified content
with open('app/(main)/fichaje/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("File modified successfully")
