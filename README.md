# 📄 PDF Search & Summarizer

An AI-powered web application to **upload, search, and summarize PDF documents**.  
Users can:
- Upload PDF files.
- Search for specific words or phrases.
- Highlight all matches inside the PDF.
- Summarize the document using an AI model.

---

## 🚀 Features
- **Drag & Drop PDF Upload** (with file size limit).
- **Real-time Search** inside the PDF.
- **Match Highlighting** with navigation between results.
- **AI Summarization** of the uploaded document.
- Responsive and modern **React UI** with TailwindCSS.
- Backend powered by **Node.js** (Express) and a **Python Core** for text processing.

---

## 🛠 Tech Stack
### Frontend
- React + TypeScript
- TailwindCSS
- Lucide React Icons
- `react-dropzone` for file uploads
- `sonner` for toast notifications
- `axios` for API requests
- `pdfjs-dist` for PDF rendering

### Backend
- Node.js + Express for API endpoints
- Multer for file uploads
- CORS for cross-origin requests
- Child process integration to run Python scripts

### Python Core
- PyMuPDF for PDF text extraction
- HuggingFace Transformers for summarization
- NLTK for text preprocessing

---

## Install dependencies
### Frontend
cd client
npm install
### Backend
cd ../server
npm install
### Python Core
cd ../core
pip install -r requirements.txt
## ▶️ Running the App
### Start the Python Core
cd core
python main.py
### Start the Backend (Node.js)
cd ../server
node app.js
### Start the Frontend (React)
cd ../client
npm run dev

