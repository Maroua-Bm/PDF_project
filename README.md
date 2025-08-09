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

## 📂 Project Structure
project/
│── client/ # React frontend
│ ├── src/
│ │ └── components/ # Upload, Search, PDF viewer components
│── server/ # Node.js backend
│ ├── routes/ # API routes
│ ├── controllers/ # Search & summarization logic
│── core/ # Python processing scripts
│── shared/ # Temporary file storage
│── README.md

## Install dependencies
Frontend
cd client
npm install
