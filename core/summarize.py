import fitz  
import sys
import json
import google.generativeai as genai

def log(message):
    print(message, file=sys.stderr)

def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
        doc.close()
        return full_text
    except Exception as e:
        log(f"[Python] Error reading PDF: {e}")
        raise

def summarize_text(text, api_key):
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        prompt = f"Summarize the following PDF content:\n\n{text[:15000]}"
        response = model.generate_content(prompt)
        log(f"[Python] Gemini response: {response}")
        return response.text
    except Exception as e:
        error_message = str(e)
        if "429" in error_message:
            raise Exception("Rate limit exceeded. Please try again later or check your API usage.")
        log(f"[ERROR] {error_message}")
        raise Exception("Internal error while summarizing PDF")

def main():
    try:
        pdf_path = sys.argv[1]
        api_key = sys.argv[2]
        log(f"[Python] PDF Path: {pdf_path}")
        text = extract_text_from_pdf(pdf_path)
        summary = summarize_text(text, api_key)
        result = {"summary": summary}
        print(json.dumps(result))
    except Exception as e:
        log(f"[Python] General Error: {e}")
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
