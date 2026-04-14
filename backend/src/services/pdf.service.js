import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
export const cleanText = (text) => {
  const cleaned = text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/Page \d+/gi, "")
    .trim();

  // 🔥 smarter chunk (beginning + middle + end)
  const chunk = 4000;

  return (
    cleaned.slice(0, chunk) +
    cleaned.slice(cleaned.length / 2, cleaned.length / 2 + chunk) +
    cleaned.slice(-chunk)
  );
};

// extract text from PDF buffer
export const extractPdfText = async (buffer) => {
  try {
    const uint8Array = new Uint8Array(buffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      text += pageText + "\n";
    }

    return text;
  } catch (err) {
    console.error("PDF EXTRACT ERROR:", err);
    throw err;
  }
};



export const splitTextIntoChunks = (text, chunkSize = 500) => {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunkText = words.slice(i, i + chunkSize).join(" ");

    chunks.push({
      content: chunkText,
      index: i / chunkSize,
    });
  }

  return chunks;
};

export const processPdfForAsk = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

  const allChunks = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items.map(item => item.str).join(" ");

    const chunks = splitTextIntoChunks(pageText);

    chunks.forEach((chunk) => {
      allChunks.push({
        content: chunk.content,
        page_number: pageNum,   // ✅ REAL PAGE
      });
    });
  }

  return allChunks;
};