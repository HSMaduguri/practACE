import test_extract
from collections import defaultdict
import re

cards = test_extract.all_raw

# Let's normalize question text to detect duplicates
def normalize_q(q):
    q = q.lower()
    q = re.sub(r'[^a-z0-9\s]', '', q)
    words = [w for w in q.split() if len(w) > 3 and w not in ['what', 'which', 'state', 'explain', 'describe', 'under', 'with', 'from', 'this', 'that', 'these', 'those', 'auditor', 'audit']]
    return set(words)

clusters = []
for c in cards:
    tokens = normalize_q(c['question'])
    placed = False
    for cl in clusters:
        # check overlap with cluster primary card
        cl_tokens = normalize_q(cl[0]['question'])
        overlap = len(tokens.intersection(cl_tokens))
        union = len(tokens.union(cl_tokens))
        jaccard = overlap / union if union > 0 else 0
        if jaccard >= 0.45 or (overlap >= 4 and overlap >= min(len(tokens), len(cl_tokens)) * 0.6):
            cl.append(c)
            placed = True
            break
    if not placed:
        clusters.append([c])

print(f"Total clusters: {len(clusters)}")
dup_clusters = [cl for cl in clusters if len(cl) > 1]
print(f"Duplicate clusters found: {len(dup_clusters)}")
for i, cl in enumerate(dup_clusters, 1):
    print(f"\nCluster {i} ({len(cl)} cards):")
    for card in cl:
        print(f"  [{card['source'].split('/')[-1]}] {card['id']} | {card['statutoryRef']} | {card['question'][:65]}...")
