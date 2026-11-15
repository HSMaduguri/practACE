import re
from collections import Counter

files = [
    'src/data/flashcards.ts',
    'src/data/audit/auditFlashcards.ts',
    'src/data/audit/auditFlashcardsPart1.ts',
    'src/data/audit/auditFlashcardsPart2.ts',
    'src/data/audit/auditFlashcardsPart3.ts',
    'src/data/audit/auditFlashcardsPart4.ts',
    'src/data/audit/auditFlashcardsPart5.ts',
    'src/data/otherSubjectsFlashcards.ts'
]

# Let's parse flashcards by extracting object blocks
all_cards = []

for filepath in files:
    with open(filepath) as f:
        content = f.read()
    
    # regex for card objects
    # find id, category, question
    blocks = re.findall(r"\{\s*id:\s*['\"]([^'\"]+)['\"].*?category:\s*['\"]([^'\"]+)['\"].*?question:\s*['\"]([^'\"]+)['\"]", content, re.DOTALL)
    for b in blocks:
        all_cards.append({
            'file': filepath,
            'id': b[0],
            'category': b[1],
            'question': b[2].strip()
        })

print(f"Total extracted: {len(all_cards)}")
ids = [c['id'] for c in all_cards]
questions = [c['question'].lower() for c in all_cards]

id_counts = Counter(ids)
q_counts = Counter(questions)

dup_ids = [k for k, v in id_counts.items() if v > 1]
dup_qs = [k for k, v in q_counts.items() if v > 1]

print(f"Duplicate IDs ({len(dup_ids)}):", dup_ids)
print(f"Duplicate Questions ({len(dup_qs)}):")
for q in dup_qs:
    matches = [c for c in all_cards if c['question'].lower() == q]
    print(f"  Q: '{q[:60]}...' found in:")
    for m in matches:
        print(f"     -> {m['file']} (id: {m['id']})")
