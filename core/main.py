import fitz
import sys
import json
import time
import re
from sentence_transformers import SentenceTransformer, util

def log(message):
    print(message, file=sys.stderr)

model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

def highlight_query_words(page, query):
    found_rects = page.search_for(query, quads=False)
    log(f"Highlighting query word: '{query}' -> Found rects: {len(found_rects)}")
    for rect in found_rects:
        annot = page.add_highlight_annot(rect)
        annot.set_colors(stroke=(1, 1, 0))  
        annot.update()
    return len(found_rects)

def main():
    try:
        pdf_path = sys.argv[1]
        query = sys.argv[2].strip()
        query_lower = query.lower()

        log(f"[Python] PDF Path: {pdf_path}")
        log(f"[Python] Search Query: {query}")

        doc = fitz.open(pdf_path)

        matched_sentences = []
        total_matches = 0
        for i, page in enumerate(doc):
            text = page.get_text()
            log(f"--- Page {i+1} Text Start ---")
            log(text)
            log(f"--- Page {i+1} Text End ---")
        query_embedding = model.encode(query, convert_to_tensor=True)

        for page_num, page in enumerate(doc, start=1):
            annot = page.first_annot
            while annot:
                next_annot = annot.next
                page.delete_annot(annot)
                annot = next_annot

            text = page.get_text()
            sentences = re.split(r'[.?!\n]', text)
            sentences = [s.strip() for s in sentences if s.strip()]

            log(f"[Page {page_num}] Total sentences extracted: {len(sentences)}")
            if not sentences:
                continue

            sentence_embeddings = model.encode(sentences, convert_to_tensor=True)
            similarities = util.cos_sim(query_embedding, sentence_embeddings)[0]

            for idx, score in enumerate(similarities):
                sentence = sentences[idx]
                log(f"[Page {page_num}] Sentence: {sentence}")
                log(f"[Page {page_num}] Similarity score: {score.item():.3f}")

                if score >= 0.2:  
                    sentence_lower = sentence.lower()
                    if re.search(r'\b' + re.escape(query_lower) + r'\b', sentence_lower):
                        log(f"[Page {page_num}] >> MATCH FOUND (semantic + exact word)")
                        matched_sentences.append(sentence)
                        highlights = highlight_query_words(page, query)
                        total_matches += 1  

        output_path = "shared/highlighted.pdf"
        doc.save(output_path, garbage=4, deflate=True, clean=True)
        doc.close()

        result = {
            "search_query": query,
            "total_matches": total_matches,
            "matched_sentences": matched_sentences,
            "highlighted_pdf": f"http://localhost:5001/static/highlighted.pdf?t={int(time.time())}"
        }
        print(json.dumps(result))

    except Exception as e:
        log("[Python] Error: " + str(e))
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
