/**
 * AutoZonIndia Google Custom Search & AI Web Lookup Service
 * Allows real-time searching of OEM Part numbers, Vehicle Specs, and Automotive Literature
 */

const CUSTOM_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID || '';

/**
 * Execute a Google Custom Search API query
 * @param {string} query Search term e.g. "Toyota Innova Crysta Brake Pad OEM Number"
 * @param {string} cx Optional Search Engine ID (CX)
 */
export const searchGoogleCustomSearch = async (query, cx = SEARCH_ENGINE_ID) => {
  if (!CUSTOM_SEARCH_API_KEY) {
    console.warn('Google Custom Search API Key is missing');
    return { success: false, message: 'API Key missing' };
  }

  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&q=${encodeURIComponent(query)}${cx ? `&cx=${cx}` : ''}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`Google Custom Search Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const items = (data.items || []).map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      displayLink: item.displayLink,
      pagemap: item.pagemap || {}
    }));

    return {
      success: true,
      query,
      totalResults: data.searchInformation?.totalResults || items.length,
      items
    };
  } catch (error) {
    console.warn('Google Custom Search API call warning:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};
