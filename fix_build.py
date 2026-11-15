with open('src/data/build_standards_60.py') as f:
    text = f.read()

old_part = """# Questions 1-10
with open('src/data/auditStandardsFullQuestions.ts', 'r') as f:
    txt = f.read()
    s = txt.find('[')
    e = txt.rfind(']') + 1
    first_10 = json.loads(txt[s:e])
    standards_questions.extend(first_10)"""

new_part = """import sys
sys.path.append('src/data')
from build_standards_full_questions import questions as first_10
standards_questions.extend(first_10)"""

text = text.replace(old_part, new_part)
with open('src/data/build_standards_60.py', 'w') as f:
    f.write(text)
print("Replaced!")
