const API_BASE = '/api';

export async function fetchDestinations(continent) {
    const url = continent ? `${API_BASE}/destinations?continent=${continent}` : `${API_BASE}/destinations`;
    const res = await fetch(url);
    return res.json();
}

export async function fetchBudgetBreakdown(data) {
    const res = await fetch(`${API_BASE}/budget-breakdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function fetchRecommendations(budget) {
    const url = budget ? `${API_BASE}/recommendations?budget=${budget}` : `${API_BASE}/recommendations`;
    const res = await fetch(url);
    return res.json();
}

export async function fetchTripDetails(params) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/trip-details?${query}`);
    return res.json();
}

export async function fetchNearbyPlaces(params) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/nearby-places?${query}`);
    return res.json();
}

export async function fetchAttractions(params) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/attractions?${query}`);
    return res.json();
}

export async function sendChatMessage(message, conversationHistory = []) {
    const res = await fetch(`${API_BASE}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory }),
    });
    return res.json();
}
