const BASE_URL = "https://breaking-api.alpha.tv2.no/v1/public";

/**
 * Henter alle tilgjengelige nyhetsportaler
 * @returns Liste av nyhetsportaler
 */
export async function fetchPortals() {
  try {
    const response = await fetch(`${BASE_URL}/portals?page=1`);
    if (!response.ok) throw new Error(`Feil ved henting av portaler: ${response.statusText}`);
    
    const data = await response.json();
    return data.docs; // Tilpass dette hvis API-strukturen er annerledes
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Henter nyheter for en spesifikk nyhetsportal
 * @param portalId ID-en til portalen
 * @returns Liste av nyhetsartikler
 */
export async function fetchNews(portalId: string) {
  try {
    const response = await fetch(`${BASE_URL}/posts?page=1&limit=10&portalId=${portalId}`);
    if (!response.ok) throw new Error(`Feil ved henting av nyheter: ${response.statusText}`);
    
    const data = await response.json();
    return data.docs; // Tilpass dette hvis API-strukturen er annerledes
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Henter en enkelt nyhetsartikkel basert på ID
 * @param newsId ID-en til nyhetsartikkelen
 * @returns Nyhetsartikkel
 */
export async function fetchSingleNews(newsId: string) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${newsId}`);
    if (!response.ok) throw new Error(`Feil ved henting av nyhetsartikkel: ${response.statusText}`);

    const data = await response.json();
    return data; // Tilpass dette hvis API-strukturen er annerledes
  } catch (error) {
    console.error(error);
    return null;
  }
}
