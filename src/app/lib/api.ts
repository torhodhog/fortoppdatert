/**
 * API-funksjoner for å hente nyheter fra TV 2s public API.
 * 
 * Denne filen inneholder funksjoner for å hente:
 * - **fetchPortals**: Alle tilgjengelige nyhetsportaler
 * - **fetchNews**: Nyheter fra en spesifikk portal
 * - **fetchSingleNews**: En spesifikk nyhetsartikkel basert på ID
 * 
 * Alle funksjoner håndterer feil og returnerer en tom liste eller `null` hvis noe går galt.
 * 
 * @module api
 */

const BASE_URL = "https://breaking-api.alpha.tv2.no/v1/public";

/**
 * Henter alle tilgjengelige nyhetsportaler fra API-et.
 * 
 * @returns {Promise<Array>} En liste med tilgjengelige nyhetsportaler.
 */
export async function fetchPortals() {
  try {
    const response = await fetch(`${BASE_URL}/portals?page=1`);
    if (!response.ok) throw new Error(`Feil ved henting av portaler: ${response.statusText}`);
    
    const data = await response.json();
    return data.docs; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Henter nyheter for en spesifikk nyhetsportal.
 * 
 * @param {string} portalId - ID-en til portalen man vil hente nyheter fra.
 * @returns {Promise<Array>} En liste med nyhetsartikler for den aktuelle portalen.
 */
export async function fetchNews(portalId: string) {
  try {
    const response = await fetch(`${BASE_URL}/posts?page=1&limit=10&portalId=${portalId}`);
    if (!response.ok) throw new Error(`Feil ved henting av nyheter: ${response.statusText}`);
    
    const data = await response.json();
    return data.docs; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Henter en spesifikk nyhetsartikkel basert på dens ID.
 * 
 * @param {string} newsId - ID-en til nyhetsartikkelen.
 * @returns {Promise<Object | null>} Nyhetsartikkelen hvis vellykket, ellers `null`.
 */
export async function fetchSingleNews(newsId: string) {
  try {
    const response = await fetch(`${BASE_URL}/posts/${newsId}`);
    if (!response.ok) throw new Error(`Feil ved henting av nyhetsartikkel: ${response.statusText}`);

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error(error);
    return null;
  }
}
