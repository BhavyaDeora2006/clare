export function evaluateClarity(text) {
    const input = text.trim().toLowerCase();

    if (!input) {
        return {
            score: 0,
            feedback: "",
            suggestions: []
        };
    }

    // --- Tokenization ---
    const words = input.match(/\b\w+\b/g) || [];
    const wordCount = words.length;

    const hasPhrase = (regex) => regex.test(input);

    let score = 0;
    const suggestions = [];
    const missing = [];

    // --- 1. Expression depth (length + detail) ---
    if (input.length > 40) {
        score += 10;
    } else {
        missing.push("expression");
        suggestions.push("Expand your thought — describe it in a bit more detail.");
    }

    if (wordCount > 15) {
        score += 10;
    } else {
        suggestions.push("Add a bit more detail so your intent becomes precise.");
    }

    // --- 2. Intent (WHY) ---
    const hasWhy = hasPhrase(/\b(because|so that|so i can|to achieve|to build|to understand)\b/);
    if (hasWhy) {
        score += 20;
    } else {
        missing.push("purpose");
        suggestions.push("Explain why this matters to you or what you want to achieve.");
    }

    // --- 3. Prior knowledge ---
    const hasKnowledge = hasPhrase(/\b(i know|i have|already|familiar|worked with|experience)\b/);
    if (hasKnowledge) {
        score += 20;
    } else {
        missing.push("context");
        suggestions.push("Mention what you already know or your current level.");
    }

    // --- 4. Struggle ---
    const hasStruggle = hasPhrase(/\b(struggle|confused|unclear|difficult|problem|stuck|hard)\b/);
    if (hasStruggle) {
        score += 25;
    } else {
        missing.push("gap");
        suggestions.push("Describe what feels confusing or where you're getting stuck.");
    }

    // --- 5. Vagueness ---
    const vagueWords = ["something", "anything", "everything", "stuff", "things"];
    const hasVague = words.some(w => vagueWords.includes(w));

    if (!hasVague) {
        score += 10;
    } else {
        missing.push("specificity");
        suggestions.push("Replace vague words with something more specific.");
    }

    // --- 6. Structure bonus ---
    const hasMultipleSentences = input.split(/[.!?]/).length > 1;
    if (hasMultipleSentences) {
        score += 5;
    }

    // --- Normalize ---
    if (score > 100) score = 100;

    // --- Smart Feedback ---
    let feedback = "";

    if (score < 30) {
        feedback = "Your intent is still forming. Try expressing it more clearly.";
    }
    else if (score < 60) {
        feedback = "You're on the right track, but some important pieces are missing.";
    }
    else if (score < 85) {
        feedback = "This is clear. Adding a bit more depth will make it strong.";
    }
    else if (score < 100) {
        feedback = "Almost there. Just refine the missing piece to make it complete.";
    }
    else {
        feedback = "Perfectly clear. Your learning path will be highly tailored.";
    }

    // --- Missing summary (this is key UX layer) ---
    let summary = "";

    if (missing.length > 0) {
        summary = "Missing: " + missing.join(", ");
    }

    return {
        score,
        feedback,
        suggestions,
        summary
    };
}