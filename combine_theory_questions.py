import json

with open("ch8_questions.json") as f:
    ch8 = json.load(f)
with open("ch9_questions.json") as f:
    ch9 = json.load(f)
with open("ch10_questions.json") as f:
    ch10 = json.load(f)
with open("ch12_questions.json") as f:
    ch12 = json.load(f)
with open("ch18_questions.json") as f:
    ch18 = json.load(f)

all_pdf_questions = ch8 + ch9 + ch10 + ch12 + ch18
print(f"Total PDF Questions: {len(all_pdf_questions)}")

ts_content = """/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ICAI STUDY MATERIAL EXHAUSTIVE THEORY QUESTIONS
 * Chapters 8, 9, 10, 12, and 18
 * Test Your Understanding (TYU) and Theoretical / Case Questions
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_PDF_THEORY_QUESTIONS: TheoryQuestion[] = """ + json.dumps(all_pdf_questions, indent=2) + ";\n"

with open("src/data/auditPdfTheoryQuestions.ts", "w") as f:
    f.write(ts_content)

print("Saved src/data/auditPdfTheoryQuestions.ts successfully.")
