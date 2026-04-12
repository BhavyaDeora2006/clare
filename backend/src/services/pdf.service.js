// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdfModule = require("pdf-parse");
// const pdf = pdfModule.default;
// // extract text
// export const extractPdfText = async (buffer) => {
//   const data = await pdf(buffer);
//   return data.text;
// };

// smart cleaning
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
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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