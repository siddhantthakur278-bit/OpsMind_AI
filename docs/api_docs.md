# API Documentation — OpsMind AI

## Base URL

```
http://localhost:8000/api
```

---

# 🔐 Authentication

All protected routes require a JWT token:

```
Authorization: Bearer <token>
```

---

# 📂 1. Upload SOP (Admin)

### Endpoint

```
POST /upload
```

### Description

Upload a PDF document. Automatically triggers:

* PDF parsing
* Chunking
* Embedding generation
* Vector storage in MongoDB

### Request

**Content-Type:** `multipart/form-data`

| Field | Type       | Required |
| ----- | ---------- | -------- |
| file  | File (PDF) | ✅        |

### Response

```json
{
  "message": "PDF processed successfully"
}
```

---

# 💬 2. Chat Query (RAG)

### Endpoint

```
POST /chat
```

### Description

Accepts a user query, retrieves relevant SOP chunks, and generates an answer using the LLM.

### Request Body

```json
{
  "query": "How do I process a refund?"
}
```

### Response

```json
{
  "answer": "According to the Refund Policy (Page 12)...",
  "sources": [
    {
      "page": 12,
      "text": "Refunds must be processed within 7 days..."
    }
  ]
}
```

### Behavior

* Uses vector similarity search (top 3–5 chunks)
* Builds context window
* Sends to LLM
* Returns answer + citations

---

# ⚡ 3. Streaming Chat (SSE)

### Endpoint

```
GET /chat/stream
```

### Description

Streams LLM response in real-time using Server-Sent Events (SSE).

### Response Format

```
data: partial response chunk

data: next chunk
```

---

# 📑 4. Get All Documents (Admin)

### Endpoint

```
GET /admin/documents
```

### Description

Fetch all uploaded SOP documents.

### Response

```json
[
  {
    "id": "doc_123",
    "name": "Refund Policy.pdf",
    "uploadedAt": "2026-04-27"
  }
]
```

---

# ❌ 5. Delete Document (Admin)

### Endpoint

```
DELETE /admin/document/:id
```

### Description

Deletes a document and all associated embeddings.

### Response

```json
{
  "message": "Document deleted successfully"
}
```

---

# 🔄 6. Reindex Documents (Admin)

### Endpoint

```
POST /admin/reindex
```

### Description

Reprocess all documents:

* Re-chunk
* Regenerate embeddings
* Update vector index

### Response

```json
{
  "message": "Reindexing started"
}
```

---

# 📊 7. Health Check

### Endpoint

```
GET /health
```

### Response

```json
{
  "status": "OK"
}
```

---

# ⚠️ Error Responses

### Example

```json
{
  "error": "Something went wrong"
}
```

### Common Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 404  | Not Found    |
| 500  | Server Error |

---

# 🧠 RAG Flow (Internal)

1. User sends query
2. Generate embedding
3. Perform MongoDB vector search
4. Retrieve top-k chunks
5. Build context prompt
6. Send to LLM
7. Return answer + sources

---

# 🚀 Future Enhancements

* Role-based access control
* Query analytics
* Feedback loop for answer quality
* Multi-language support
* Voice input API

---
