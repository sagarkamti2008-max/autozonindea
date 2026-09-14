/**
 * AutoZonIndia Google Gemini AI Integration Service
 * Real-time Automotive Part Recommendation & Natural Language Query Processor
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const callGeminiAI = async (userPrompt, availableProducts = [], selectedVehicle = null) => {
  try {
    const productCatalogContext = availableProducts.slice(0, 35).map(p => ({
      id: p.id,
      title: p.title || p.name,
      partNumber: p.partNumber,
      category: p.category,
      price: p.price,
      compatibility: p.compatibility || p.vehicles || []
    }));

    const systemContext = `
You are the AI Automotive Expert for AutoZonIndia (India's leading car spare parts & accessories platform).
Customer's Current Selected Vehicle: ${selectedVehicle ? JSON.stringify(selectedVehicle) : 'Not specified'}.
Available Product Catalog (sample): ${JSON.stringify(productCatalogContext)}.

User Question: "${userPrompt}"

Instructions:
1. Provide a concise, highly knowledgeable, professional automotive advice in 2-3 sentences.
2. Mention OEM specs, viscosity/compatibility tips if relevant.
3. Keep tone friendly and expert.
`;

    // Try Gemini 1.5 Flash endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemContext }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      // If error (e.g. key issue or rate limit), throw error to trigger smart fallback
      throw new Error(`Gemini API Error: Status ${response.status}`);
    }

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error('Empty response from Gemini API');
    }

    return {
      success: true,
      text: aiText,
      source: 'Google Gemini AI Live Model'
    };
  } catch (err) {
    console.warn('Gemini API call warning/fallback:', err.message);
    return {
      success: false,
      error: err.message
    };
  }
};
