# System Architecture — OpsMind AI

## 🧠 Overview

OpsMind AI is a **Context-Aware Corporate Knowledge Brain** built using a Retrieval-Augmented Generation (RAG) architecture. It enables employees to query large volumes of SOP documents and receive accurate, source-backed answers with minimal latency and zero hallucination.

---

# 🏗️ High-Level Architecture

```id="arch1"
                ┌──────────────────────┐
                │     Frontend UI      │
                │ (React + Chat UI)   │
                └─────────┬────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │     API Server       │
                │    (Node + Express)  │
                └─────────┬────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                                   ▼
┌──────────────────┐              ┌────────────────────┐
│ Ingestion Engine │              │  Retrieval Engine  │
│ (PDF → Chunks →  │              │ (Vector Search +   │
│  Embeddings)     │              │  Context Builder)  │
└────────┬─────────┘              └─────────┬──────────┘
         │                                  │
         ▼                                  ▼
 ┌──────────────────┐              ┌────────────────────┐
 │  Vector Database │              │     LLM Layer      │
 │ (MongoDB Atlas)  │              │ (Gemini 1.5 Flash) │
 └──────────────────┘              └────────────────────┘
```

---

# 🔄 Core System Flow

## 1. Document Ingestion Flow (Admin)

```id="arch2"
Admin Upload → PDF Parser → Text Chunking → Embedding Generation → MongoDB Storage
```

### Steps:

1. Admin uploads SOP PDF
2. PDF is parsed into raw text
3. Text is split into chunks (1000 chars, 100 overlap)
4. Each chunk is converted into a vector embedding
5. Stored in MongoDB Atlas with metadata:

   * document ID
   * page number
   * section reference

---

## 2. Query Processing Flow (User)

```id="arch3"
User Query → Embedding → Vector Search → Context Building → LLM → Response + Sources
```

### Steps:

1. User submits a query
2. Query is converted into embedding
3. MongoDB performs vector similarity search
4. Top 3–5 relevant chunks are retrieved
5. Context window is constructed
6. Sent to LLM for answer generation
7. Response returned with source citations

---

# 🧩 System Components

## 🔹 1. Frontend Layer

* Chat interface
* Source viewer (PDF highlighting)
* Admin dashboard
* Real-time streaming UI

---

## 🔹 2. API Layer (Backend)

* Handles all client requests
* Routes:

  * `/chat`
  * `/upload`
  * `/admin`
* Implements business logic

---

## 🔹 3. Ingestion Engine

Responsible for:

* PDF parsing
* Text chunking
* Embedding generation
* Indexing into database

**Runs asynchronously for scalability**

---

## 🔹 4. Vector Database

* MongoDB Atlas with Vector Search
* Stores:

  * embeddings
  * text chunks
  * metadata

---

## 🔹 5. Retrieval Engine

* Performs semantic similarity search
* Retrieves top-k relevant chunks
* Optional re-ranking layer for improved accuracy

---

## 🔹 6. Context Builder

* Combines:

  * user query
  * retrieved chunks
* Formats prompt for LLM

---

## 🔹 7. LLM Layer

* Generates final response
* Enforces:

  * source-based answering
  * “I don’t know” fallback

---

## 🔹 8. Streaming Layer

* Uses Server-Sent Events (SSE)
* Streams responses in real-time

---

# 🗄️ Data Model

## Document

```json id="arch4"
{
  "id": "doc_123",
  "name": "Refund Policy.pdf",
  "uploadedAt": "timestamp"
}
```

## Chunk

```json id="arch5"
{
  "text": "Refunds must be processed...",
  "embedding": [0.123, 0.456, ...],
  "documentId": "doc_123",
  "page": 12
}
```

---

# ⚙️ Key Design Decisions

## ✅ Why RAG?

* Avoids hallucination
* Uses real company data
* Provides verifiable answers

---

## ✅ Why MongoDB Vector Search?

* Combines vector + metadata queries
* Reduces system complexity
* Scales easily

---

## ✅ Why Separate Ingestion Pipeline?

* Improves performance
* Enables asynchronous processing
* Supports large document sets

---

# 🚀 Scalability Considerations

* Stateless API → horizontal scaling
* Separate ingestion service → background processing
* Vector DB optimized for semantic search
* Caching layer (Redis) for frequent queries
* Queue system (BullMQ) for heavy workloads

---

# 🔐 Security Architecture

* JWT-based authentication
* Role-based access:

  * Admin → manage SOPs
  * User → query system
* Secure file uploads
* API rate limiting (optional)

---

# ⚡ Performance Optimizations

* Chunk size tuning (1000 chars, 100 overlap)
* Top-k retrieval (3–5 chunks)
* Caching frequent queries
* Streaming responses for better UX

---

# 🧠 Hallucination Prevention Strategy

* Strict context-based prompting
* No external knowledge allowed
* Confidence threshold filtering
* Fallback response:

  > “I don’t know”

---

# 🔮 Future Improvements

* Multi-language support
* Voice-based queries
* Advanced re-ranking models
* Knowledge graph integration
* SOP gap detection system
* Analytics dashboard

---

# 🏁 Summary

OpsMind AI is designed as a **scalable, production-ready RAG system** that transforms static SOP documents into an intelligent, queryable knowledge base with:

* High accuracy
* Source transparency
* Real-time interaction
* Enterprise scalability

---
