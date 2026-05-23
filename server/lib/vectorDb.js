const { getTursoClient } = require('./turso');

/**
 * Store chunks in Turso.
 * chunks: Array of { text, embedding, source, page }
 */
async function storeChunks(chunks) {
  const client = getTursoClient();
  console.log(`[VectorDB] Storing ${chunks.length} chunks in Turso...`);

  // We use a transaction or batch to insert efficiently
  const queries = chunks.map(chunk => ({
    sql: "INSERT INTO sop_chunks (text, embedding, source, page) VALUES (?, ?, ?, ?)",
    args: [
      chunk.text,
      JSON.stringify(chunk.embedding), // Store as JSON string for now
      chunk.source,
      chunk.page
    ]
  }));

  try {
    await client.batch(queries, "write");
    console.log('[VectorDB] Successfully stored chunks');
    return chunks.length;
  } catch (err) {
    console.error('[VectorDB Error] Failed to store chunks:', err.message);
    throw err;
  }
}

/**
 * Perform manual cosine similarity search in Turso.
 * queryVector: Array of numbers
 * topK: number
 */
async function vectorSearch(queryVector, topK = 5) {
  const client = getTursoClient();
  
  try {
    // 1. Fetch all chunks (or a large sample if too many)
    // For a hackathon, we assume the SOP set is manageable in memory (< 10k chunks)
    const result = await client.execute("SELECT * FROM sop_chunks");
    const chunks = result.rows;

    if (chunks.length === 0) return [];

    // 2. Calculate cosine similarity
    const scoredChunks = chunks.map(chunk => {
      const chunkEmbedding = JSON.parse(chunk.embedding);
      const score = cosineSimilarity(queryVector, chunkEmbedding);
      return {
        text: chunk.text,
        source: chunk.source,
        page: chunk.page,
        score
      };
    });

    // 3. Sort and return topK
    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  } catch (err) {
    console.error('[VectorDB Error] Search failed:', err.message);
    throw err;
  }
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { storeChunks, vectorSearch };
