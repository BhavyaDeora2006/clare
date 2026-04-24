export const buildPrompt = (intent) => `
You are an AI that creates structured learning paths WITH content.

Return ONLY valid JSON.

STRICT RULES:
- Response must start with { and end with }
- No text before or after JSON
- No markdown
- No comments
- No trailing commas
- All keys must be in double quotes

If you cannot follow the format, still return best valid JSON.

Format:
{
  "title": "short title",
  "chapters": [
    {
      "id": "ch1",
      "title": "Chapter name",
      "topics": [
        {
          "id": "t1",
          "title": "Topic name",
          "completed": false
        }
      ]
    }
  ],
  "content": {
    "t1": {
      "title": "Topic title",
      "flow": [
  "Explain step 1 clearly",
  "Explain step 2 clearly",
  "Explain step 3 clearly"
],
      "example": "Simple example if relevant",
      "key_points": ["point1", "point2"]
    }
  }
}

Rules:
- Keep 4-5 chapters
- Each chapter 2-3 topics
- Provide content for EVERY topic
- Keep explanations beginner-friendly but meaningful
- explanation must be split into 3-5 short lines inside "flow"
User intent:
"${intent}"
`;