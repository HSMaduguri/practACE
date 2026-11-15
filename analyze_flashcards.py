# Script to examine all flashcards and design deduplication
import re
import json

files = [
    ('src/data/audit/auditFlashcards.ts', 'base'),
    ('src/data/audit/auditFlashcardsPart1.ts', 'p1'),
    ('src/data/audit/auditFlashcardsPart2.ts', 'p2'),
    ('src/data/audit/auditFlashcardsPart3.ts', 'p3'),
    ('src/data/audit/auditFlashcardsPart4.ts', 'p4'),
    ('src/data/audit/auditFlashcardsPart5.ts', 'p5')
]

cards_by_file = {}

for fn, tag in files:
    with open(fn) as f:
        txt = f.read()
    
    # Extract flashcard objects: id, category, statutoryRef, examImportance, question, summaryClean
    # Let's use regex to extract id and question
    card_matches = re.finditer(r"id:\s*['\"]([^'\"]+)['\"].*?category:\s*['\"]([^'\"]+)['\"].*?statutoryRef:\s*['\"]([^'\"]+)['\"].*?examImportance:\s*['\"]([^'\"]+)['\"].*?question:\s*['\"]([^'\"]+)['\"].*?summaryClean:\s*['\"]([^'\"]+)['\"]", txt, re.DOTALL)
    cards = []
    for m in card_matches:
        cards.append({
            'id': m.group(1),
            'category': m.group(2),
            'statutoryRef': m.group(3),
            'examImportance': m.group(4),
            'question': m.group(5).strip(),
            'summaryClean': m.group(6).strip(),
            'source': tag
        })
    cards_by_file[tag] = cards
    print(f"{tag}: {len(cards)} cards")

# Check semantic duplicates by question keyword matching
all_cards = []
for tag, cards in cards_by_file.items():
    all_cards.extend(cards)

print(f"Total cards currently: {len(all_cards)}")
