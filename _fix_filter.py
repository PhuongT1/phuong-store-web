import re

path = "src/components/product/product-list/ProductFilterAttributeSections.tsx"
with open(path, "r") as f:
    content = f.read()

# Fix ugly inline void submit() — the pattern is:
# { shouldDirty: true }
#                                                                            );                                                                       void submit();                                                                  }}
# We need to make it properly formatted

# Use regex to find and fix the inline patterns
content = re.sub(
    r'(\{ shouldDirty: true \}\s*\);)\s+void submit\(\);\s+(\}\})',
    r'\1\n                                                                            void submit();\n                                                                            \2',
    content
)

# Brand onCheckedChange still missing void submit() — add it
# Find the brand block: the onCheckedChange that references selectedBrands
content = re.sub(
    r'(onCheckedChange=\{\(checked\) => \{\n\s+const cur = selectedBrands.*?\n\s+methods\.setValue.*?\n\s+shouldDirty: true\n\s+\}\);\n)(\s+\}\})',
    r'\1\g<2>',  # placeholder - we need to insert before the closing }}
    content,
    flags=re.DOTALL
)

# Simpler: just check if brand already has void submit()
if "brand" in content and "onCheckedChange" in content:
    # find position
    idx = content.find("onCheckedChange={(checked) => {")
    if idx != -1:
        segment = content[idx:idx+500]
        if "void submit();" not in segment:
            # Find the }); pattern after shouldDirty
            sub = re.sub(
                r'(shouldDirty: true\n\s+\}\);\n)(\s+\}\})',
                r'\1                                                                            void submit();\n\2',
                content[idx:idx+500],
                count=1
            )
            if sub != content[idx:idx+500]:
                content = content[:idx] + sub + content[idx+500:]
                print("Brand: void submit() added ✅")
            else:
                print("Brand: substitution pattern not matched")
        else:
            print("Brand: void submit() already present ✅")

with open(path, "w") as f:
    f.write(content)

# Verify
with open(path, "r") as f:
    final = f.read()
count = final.count("void submit()")
print(f"Total void submit() calls in file: {count}")
