# Setup Guide — OpsMind AI

## 🧠 Overview

This guide walks you through setting up the OpsMind AI project locally, including:

* Backend (Node.js + Express)
* Frontend (React)
* Database (MongoDB Atlas)
* Environment configuration

---

# 📦 Prerequisites

Make sure you have the following installed:

* Node.js (v18 or higher)
* npm or yarn
* Git
* MongoDB Atlas account

---

# 📁 1. Clone the Repository

```bash
git clone <your-repo-url>
cd OpsMind-AI
```

---

# ⚙️ 2. Backend Setup

```bash
cd server
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside `/server`:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

JWT_SECRET=your_secret
```

---

## ▶️ Run Backend

```bash
npm run dev
```

Server will start at:

```bash
http://localhost:8000
```

---

# 💻 3. Frontend Setup

```bash
cd ../client
npm install
```

## 🔐 Environment Variables

Create `.env` inside `/client`:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## ▶️ Run Frontend

```bash
npm run dev
```

App will run at:

```bash
http://localhost:5173
```

---

# 🗄️ 4. Database Setup (MongoDB Atlas)

1. Create a cluster
2. Create a database (e.g., `opsmind`)
3. Create collections:

   * `documents`
   * `chunks`

---

## 🔍 Enable Vector Search

Create a vector index on the `chunks` collection:

* Field: `embedding`
* Type: `knnVector`
* Dimensions: (depends on embedding model, e.g., 1536)

---

# 📂 5. Upload Folder

Ensure the uploads directory exists:

```bash
mkdir -p server/uploads
```

---

# 🧪 6. Test the System

### Upload SOP

```bash
POST /api/upload
```

### Query Chat

```bash
POST /api/chat
```

---

# 🐳 7. (Optional) Docker Setup

```bash
cd docker
docker-compose up --build
```

---

# ⚡ 8. Development Tips

* Use Postman or Thunder Client to test APIs
* Keep chunk size consistent (1000 chars recommended)
* Monitor MongoDB Atlas logs for query performance

---

# 🛠️ Common Issues

## ❌ MongoDB Connection Error

* Check IP whitelist in Atlas
* Verify connection string

---

## ❌ Empty Responses from Chat

* Ensure embeddings are generated
* Check vector index configuration

---

## ❌ LLM Not Responding

* Verify API keys
* Check rate limits

---

# 🚀 Production Notes

* Use environment-based configs
* Enable HTTPS
* Add rate limiting
* Use Redis for caching
* Deploy backend on cloud (AWS / GCP / Render)
* Deploy frontend on Vercel

---

# 🏁 You're Ready!

Once everything is running:

* Upload SOP documents
* Start querying
* Explore source-based answers

---
