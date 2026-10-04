
import re
import sys

try:
    with open('e:/dbclient/client/src/pages/BookingPage.tsx', 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r'ServiceVariant,\s*', '', c)
    c = re.sub(r'initialVariantId\?: string;', '', c)
    c = re.sub(r'initialVariantId,?', '', c)
    c = re.sub(r'// Selected Variants state.*?\[selectedVariantIds, setSelectedVariantIds\] = useState<string\[\]>\(.*?;\n', '', c, flags=re.DOTALL)

    c = re.sub(r'if \(s\.variants.*?else \{\s*setSelectedVariantIds\(\[\]\);\s*\}', '', c, flags=re.DOTALL)
    c = re.sub(r'if \(s\.variants.*?setSelectedVariantIds\(\[s\.variants\[0\]\.id\]\);\s*\}', '', c, flags=re.DOTALL)
    c = re.sub(r'let vMatch.*?setSelectedVariantIds\(\[\]\);\s*\}', '', c, flags=re.DOTALL)
    c = re.sub(r'if \(match\.variants.*?setSelectedVariantIds\(\[\]\);\s*\}', '', c, flags=re.DOTALL)

    c = re.sub(r'const variantsPrice =.*?: 0;', 'const variantsPrice = 0;', c, flags=re.DOTALL)
    c = re.sub(r'\(variantsPrice \|\| selectedService\?\.startingPrice \|\| 0\)', '(selectedService?.startingPrice || 0)', c)

    c = re.sub(r'variants: selectedVariantIds,', '', c)
    c = re.sub(r'Select category → service → variant option → custom add-ons', 'Select category → service → custom add-ons', c)
    c = re.sub(r'\{/\* 3\. VARIANT / OPTION CARDS \*/\}.*?\{/\* 4\. ADD-ONS SELECTOR \*/\}', '{/* 4. ADD-ONS SELECTOR */}', c, flags=re.DOTALL)

    c = re.sub(r'selectedVariantIds=\{selectedVariantIds\}', '', c)

    # Remove the summary option row for variants
    c = re.sub(r'<div className=\'flex justify-between\'><span className=\'text-slate-500\'>Options / Variants:</span>.*?</div>', '', c, flags=re.DOTALL)
    
    with open('e:/dbclient/client/src/pages/BookingPage.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print('done')
except Exception as e:
    print(e)
