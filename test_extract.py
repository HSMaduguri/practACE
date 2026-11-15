# Build clean flashcards generator
import re
import json

def extract_raw_cards(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    cards = []
    # Pattern to match { id: '...', ... summaryClean: '...' }
    # Let's match from `{ \n id:` to the next card or end
    pattern = re.compile(
        r"\{\s*id:\s*['\"](?P<id>[^'\"]+)['\"],\s*"
        r"subjectId:\s*['\"](?P<subjectId>[^'\"]+)['\"],\s*"
        r"category:\s*['\"](?P<category>[^'\"]+)['\"],\s*"
        r"statutoryRef:\s*['\"](?P<statutoryRef>[^'\"]+)['\"],\s*"
        r"examImportance:\s*['\"](?P<examImportance>[^'\"]+)['\"],\s*"
        r"question:\s*(?P<question>['\"`].*?['\"`]),\s*"
        r"answerHtml:\s*`(?P<answerHtml>.*?)`,\s*"
        r"summaryClean:\s*(?P<summaryClean>['\"`].*?['\"`])\s*\}",
        re.DOTALL
    )

    for m in pattern.finditer(content):
        # strip quotes from question and summaryClean
        q_raw = m.group('question').strip()
        if (q_raw.startswith("'") and q_raw.endswith("'")) or (q_raw.startswith('"') and q_raw.endswith('"')) or (q_raw.startswith('`') and q_raw.endswith('`')):
            q_clean = q_raw[1:-1].strip()
        else:
            q_clean = q_raw

        s_raw = m.group('summaryClean').strip()
        if (s_raw.startswith("'") and s_raw.endswith("'")) or (s_raw.startswith('"') and s_raw.endswith('"')) or (s_raw.startswith('`') and s_raw.endswith('`')):
            s_clean = s_raw[1:-1].strip()
        else:
            s_clean = s_raw

        cards.append({
            'id': m.group('id'),
            'subjectId': m.group('subjectId'),
            'category': m.group('category'),
            'statutoryRef': m.group('statutoryRef'),
            'examImportance': m.group('examImportance'),
            'question': q_clean,
            'answerHtml': m.group('answerHtml').strip(),
            'summaryClean': s_clean,
            'source': filepath
        })
    return cards

files = [
    'src/data/audit/auditFlashcards.ts',
    'src/data/audit/auditFlashcardsPart1.ts',
    'src/data/audit/auditFlashcardsPart2.ts',
    'src/data/audit/auditFlashcardsPart3.ts',
    'src/data/audit/auditFlashcardsPart4.ts',
    'src/data/audit/auditFlashcardsPart5.ts'
]

all_raw = []
for fn in files:
    extracted = extract_raw_cards(fn)
    print(f"{fn}: extracted {len(extracted)}")
    all_raw.extend(extracted)

print(f"Total raw cards extracted: {len(all_raw)}")
