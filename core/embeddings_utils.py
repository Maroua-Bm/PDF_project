from sentence_transformers import SentenceTransformer, util
import fitz  # PyMuPDF
import re

model = SentenceTransformer("sentence-transformers/distiluse-base-multilingual-cased-v2")

def load_pdf_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    sentences = re.split(r'[.!؟\n]+', text)
    return [s.strip().lower() for s in sentences if len(s.strip()) > 0]

def embed_texts(texts):
    return model.encode(texts, convert_to_tensor=True)


def search_query(sentences, query, pdf_path=None):
    query_lower = query.lower()

    # Exact matches (word or sentence)
    matched_sentences = [s for s in sentences if query_lower in s.lower()]
    total_matches = len(matched_sentences)

    # Top match with semantic similarity (optional, keep yours here)
    top_matched = matched_sentences[0] if matched_sentences else ""
    score = 1.0 if matched_sentences else 0.0

    highlighted_pdf_path = None
    if pdf_path and matched_sentences:
        doc = fitz.open(pdf_path)
        for page in doc:
            text_instances = page.search_for(query, hit_max=1000, quads=False)  # case-insensitive if query is lowercase
            for inst in text_instances:
                page.add_highlight_annot(inst)
        highlighted_pdf_path = "highlighted.pdf"
        doc.save(highlighted_pdf_path)
        doc.close()

    return {
        "top_matched_sentence": top_matched,
        "top_score": score,
        "total_matches": total_matches,
        "matched_sentences": matched_sentences,
        "highlighted_pdf": highlighted_pdf_path
    }