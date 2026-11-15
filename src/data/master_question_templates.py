# High-yield generator for CA Final Master Questions Bank (370-page coverage)

def make_q(qid, subject_id, chapter, title, diff, marks, exam_ref, q_text, concepts, answer, eff_reason, misses, suggs):
    return {
        "id": qid,
        "subjectId": subject_id,
        "chapterName": chapter,
        "title": title,
        "difficulty": diff,
        "marks": marks,
        "icaiExamRef": exam_ref,
        "question": q_text,
        "keyConcepts": concepts,
        "shortSuggestedAnswer": answer,
        "defaultRemarks": {
            "efficiencyReasoning": eff_reason,
            "criticalMisses": misses,
            "suggestions": suggs
        }
    }
