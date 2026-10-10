import {
  parseIntentFromInput,
  searchRoutes,
  evaluateDisruptionRisk,
  calculateRecoveryOptions
} from '../transportEngine';

// Central configuration for Spring Boot API base URL
// Usage in .env or app environment: EXPO_PUBLIC_API_BASE_URL=http://<YOUR_SPRING_BOOT_HOST>:8080
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Configured Spring Boot API endpoint placeholders
export const ENDPOINTS = {
  INITIAL_DATA: `${API_BASE_URL}/initial-data`,
  CHAT_PROCESS: `${API_BASE_URL}/chat/process`,
  TRIP_SEARCH: `${API_BASE_URL}/trips/search`,
  ITINERARY_DETAILS: `${API_BASE_URL}/itinerary`,
  ALERTS: `${API_BASE_URL}/alerts/disruption`,
  RECOVERY_OPTIONS: `${API_BASE_URL}/recovery/options`,
  APPROVAL: `${API_BASE_URL}/approval/confirm`,
  PASS: `${API_BASE_URL}/journey/pass`,
};

// Generic fetch wrapper with timeout and fallback support
async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * 1. Fetch initial application data
 */
export async function getInitialData() {
  try {
    return await apiRequest(ENDPOINTS.INITIAL_DATA);
  } catch (error) {
    console.warn('[API Service] Backend unavailable for initial data, falling back to local defaults.');
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      message: 'Initial travel system data loaded.',
    };
  }
}

/**
 * 2. Process natural language query / travel request in chat
 */
export async function sendChatMessage(userPrompt, language = 'en') {
  try {
    return await apiRequest(ENDPOINTS.CHAT_PROCESS, {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt, language }),
    });
  } catch (error) {
    console.warn('[API Service] Spring Boot chat endpoint offline. Using local AI parser fallback.');
    const extractedIntent = parseIntentFromInput(userPrompt, language);
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      message: language === 'te'
        ? `మీ అభ్యర్థనను విశ్లేషించాను. విశాఖపట్నం నుండి హైదరాబాద్ ప్రయాణానికి ఉదయం 9:00 గంటల గడువు మరియు ₹1,500 బడ్జెట్‌తో రూట్‌లు వెతుకుతున్నాను.`
        : `I've processed your travel request for Vizag to Hyderabad (arriving before 9:00 AM, AC Sleeper under ₹1,500). Let's review the details.`,
      intent: extractedIntent,
    };
  }
}

/**
 * 3. Search trip itineraries
 */
export async function fetchTripSearchResults(intent) {
  try {
    return await apiRequest(ENDPOINTS.TRIP_SEARCH, {
      method: 'POST',
      body: JSON.stringify(intent),
    });
  } catch (error) {
    console.warn('[API Service] Spring Boot trip search endpoint offline. Using local search engine.');
    const results = searchRoutes(intent);
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      results,
    };
  }
}

/**
 * 4. Retrieve Itinerary Details
 */
export async function fetchItineraryDetails(itineraryId) {
  try {
    return await apiRequest(`${ENDPOINTS.ITINERARY_DETAILS}/${itineraryId}`);
  } catch (error) {
    console.warn('[API Service] Spring Boot itinerary endpoint offline.');
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      itineraryId,
    };
  }
}

/**
 * 5. Retrieve Disruption Alert Status
 */
export async function fetchDisruptionStatus(activeItinerary, delayMinutes = 50) {
  try {
    return await apiRequest(ENDPOINTS.ALERTS, {
      method: 'POST',
      body: JSON.stringify({ itineraryId: activeItinerary?.id, delayMinutes }),
    });
  } catch (error) {
    console.warn('[API Service] Spring Boot alerts endpoint offline. Using local risk evaluator.');
    const disruption = evaluateDisruptionRisk(activeItinerary, delayMinutes);
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      disruption,
    };
  }
}

/**
 * 6. Retrieve Recovery Alternatives
 */
export async function fetchRecoveryOptions(activeItinerary, disruption, intent) {
  try {
    return await apiRequest(ENDPOINTS.RECOVERY_OPTIONS, {
      method: 'POST',
      body: JSON.stringify({ itineraryId: activeItinerary?.id, scenarioId: disruption?.scenarioId }),
    });
  } catch (error) {
    console.warn('[API Service] Spring Boot recovery endpoint offline. Using local recovery planner.');
    const proposals = calculateRecoveryOptions(activeItinerary, disruption, intent);
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      proposals,
    };
  }
}

/**
 * 7. Approve Revised Itinerary
 */
export async function approveItineraryChange(proposalId, originalItineraryId) {
  try {
    return await apiRequest(ENDPOINTS.APPROVAL, {
      method: 'POST',
      body: JSON.stringify({ proposalId, originalItineraryId }),
    });
  } catch (error) {
    console.warn('[API Service] Spring Boot approval endpoint offline. Approving locally.');
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      confirmed: true,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 8. Retrieve Pass / Confirmed Journey
 */
export async function fetchConfirmedPass(itineraryId) {
  try {
    return await apiRequest(`${ENDPOINTS.PASS}/${itineraryId}`);
  } catch (error) {
    console.warn('[API Service] Spring Boot pass endpoint offline.');
    return {
      status: 'SUCCESS',
      source: 'LOCAL_FALLBACK',
      itineraryId,
    };
  }
}
