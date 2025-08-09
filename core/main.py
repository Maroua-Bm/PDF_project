import fitz  
import sys
import json
import time

def log(message):
    print(message, file=sys.stderr)

def highlight_text(page, search_phrase):
    text_instances = []
    found_rects = page.search_for(search_phrase, quads=False)
    for rect in found_rects:
        annot = page.add_highlight_annot(rect)
        annot.set_colors(stroke=(1, 1, 0))  
        annot.update()
        text_instances.append(rect)
    return len(text_instances)

def main():
    try:
        pdf_path = sys.argv[1]
        query = sys.argv[2].strip()
        log(f"[Python] PDF Path: {pdf_path}")
        log(f"[Python] Search Query: {query}")
        doc = fitz.open(pdf_path)
        total_matches = 0
        matched_sentences = []
        for page_num, page in enumerate(doc, start=1):
            annot = page.first_annot
            while annot:
                next_annot = annot.next
                page.delete_annot(annot)
                annot = next_annot
            text = page.get_text()
            sentences = [s.strip() for s in text.split('.') if s.strip()]
            for sent in sentences:
                if query.lower() in sent.lower():
                    matched_sentences.append(sent)
            count = highlight_text(page, query)
            total_matches += count
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

