/**
 * City database with latitude, longitude, timezone, and country.
 * 100+ world cities covering all major timezones and populated areas.
 */
const CITIES = [
  // India
  { name: 'Mumbai', country: 'IN', lat: 19.076, lon: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Bangalore', country: 'IN', lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Hyderabad', country: 'IN', lat: 17.3850, lon: 78.4867, tz: 'Asia/Kolkata' },
  { name: 'Chennai', country: 'IN', lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Kolkata', country: 'IN', lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata' },
  { name: 'Pune', country: 'IN', lat: 18.5204, lon: 73.8567, tz: 'Asia/Kolkata' },
  { name: 'Ahmedabad', country: 'IN', lat: 23.0225, lon: 72.5714, tz: 'Asia/Kolkata' },
  { name: 'Jaipur', country: 'IN', lat: 26.9124, lon: 75.7873, tz: 'Asia/Kolkata' },
  { name: 'Lucknow', country: 'IN', lat: 26.8467, lon: 80.9462, tz: 'Asia/Kolkata' },
  { name: 'Chandigarh', country: 'IN', lat: 30.7333, lon: 76.7794, tz: 'Asia/Kolkata' },
  { name: 'Kochi', country: 'IN', lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  { name: 'Indore', country: 'IN', lat: 22.7196, lon: 75.8577, tz: 'Asia/Kolkata' },
  { name: 'Bhopal', country: 'IN', lat: 23.2599, lon: 77.4126, tz: 'Asia/Kolkata' },
  { name: 'Nagpur', country: 'IN', lat: 21.1458, lon: 79.0882, tz: 'Asia/Kolkata' },
  { name: 'Varanasi', country: 'IN', lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
  { name: 'Surat', country: 'IN', lat: 21.1702, lon: 72.8311, tz: 'Asia/Kolkata' },
  { name: 'Patna', country: 'IN', lat: 25.6093, lon: 85.1376, tz: 'Asia/Kolkata' },
  { name: 'Guwahati', country: 'IN', lat: 26.1445, lon: 91.7362, tz: 'Asia/Kolkata' },
  { name: 'Thiruvananthapuram', country: 'IN', lat: 8.5241, lon: 76.9366, tz: 'Asia/Kolkata' },
  { name: 'Coimbatore', country: 'IN', lat: 11.0168, lon: 76.9558, tz: 'Asia/Kolkata' },
  { name: 'Visakhapatnam', country: 'IN', lat: 17.6868, lon: 83.2185, tz: 'Asia/Kolkata' },
  { name: 'Amritsar', country: 'IN', lat: 31.6340, lon: 74.8723, tz: 'Asia/Kolkata' },

  // USA
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437, tz: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'US', lat: 41.8781, lon: -87.6298, tz: 'America/Chicago' },
  { name: 'Houston', country: 'US', lat: 29.7604, lon: -95.3698, tz: 'America/Chicago' },
  { name: 'Phoenix', country: 'US', lat: 33.4484, lon: -112.0740, tz: 'America/Phoenix' },
  { name: 'San Francisco', country: 'US', lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles' },
  { name: 'Miami', country: 'US', lat: 25.7617, lon: -80.1918, tz: 'America/New_York' },
  { name: 'Seattle', country: 'US', lat: 47.6062, lon: -122.3321, tz: 'America/Los_Angeles' },
  { name: 'Denver', country: 'US', lat: 39.7392, lon: -104.9903, tz: 'America/Denver' },
  { name: 'Austin', country: 'US', lat: 30.2672, lon: -97.7431, tz: 'America/Chicago' },
  { name: 'Boston', country: 'US', lat: 42.3601, lon: -71.0589, tz: 'America/New_York' },
  { name: 'Atlanta', country: 'US', lat: 33.7490, lon: -84.3880, tz: 'America/New_York' },
  { name: 'Washington DC', country: 'US', lat: 38.9072, lon: -77.0369, tz: 'America/New_York' },
  { name: 'Las Vegas', country: 'US', lat: 36.1699, lon: -115.1398, tz: 'America/Los_Angeles' },
  { name: 'Nashville', country: 'US', lat: 36.1627, lon: -86.7816, tz: 'America/Chicago' },
  { name: 'Honolulu', country: 'US', lat: 21.3069, lon: -157.8583, tz: 'Pacific/Honolulu' },

  // Europe
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
  { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050, tz: 'Europe/Berlin' },
  { name: 'Rome', country: 'IT', lat: 41.9028, lon: 12.4964, tz: 'Europe/Rome' },
  { name: 'Madrid', country: 'ES', lat: 40.4168, lon: -3.7038, tz: 'Europe/Madrid' },
  { name: 'Amsterdam', country: 'NL', lat: 52.3676, lon: 4.9041, tz: 'Europe/Amsterdam' },
  { name: 'Vienna', country: 'AT', lat: 48.2082, lon: 16.3738, tz: 'Europe/Vienna' },
  { name: 'Lisbon', country: 'PT', lat: 38.7223, lon: -9.1393, tz: 'Europe/Lisbon' },
  { name: 'Stockholm', country: 'SE', lat: 59.3293, lon: 18.0686, tz: 'Europe/Stockholm' },
  { name: 'Dublin', country: 'IE', lat: 53.3498, lon: -6.2603, tz: 'Europe/Dublin' },
  { name: 'Athens', country: 'GR', lat: 37.9838, lon: 23.7275, tz: 'Europe/Athens' },
  { name: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6173, tz: 'Europe/Moscow' },
  { name: 'Istanbul', country: 'TR', lat: 41.0082, lon: 28.9784, tz: 'Europe/Istanbul' },
  { name: 'Zurich', country: 'CH', lat: 47.3769, lon: 8.5417, tz: 'Europe/Zurich' },
  { name: 'Copenhagen', country: 'DK', lat: 55.6761, lon: 12.5683, tz: 'Europe/Copenhagen' },
  { name: 'Oslo', country: 'NO', lat: 59.9139, lon: 10.7522, tz: 'Europe/Oslo' },
  { name: 'Helsinki', country: 'FI', lat: 60.1699, lon: 24.9384, tz: 'Europe/Helsinki' },
  { name: 'Warsaw', country: 'PL', lat: 52.2297, lon: 21.0122, tz: 'Europe/Warsaw' },
  { name: 'Prague', country: 'CZ', lat: 50.0755, lon: 14.4378, tz: 'Europe/Prague' },
  { name: 'Budapest', country: 'HU', lat: 47.4979, lon: 19.0402, tz: 'Europe/Budapest' },
  { name: 'Bucharest', country: 'RO', lat: 44.4268, lon: 26.1025, tz: 'Europe/Bucharest' },

  // Asia
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074, tz: 'Asia/Shanghai' },
  { name: 'Shanghai', country: 'CN', lat: 31.2304, lon: 121.4737, tz: 'Asia/Shanghai' },
  { name: 'Hong Kong', country: 'HK', lat: 22.3193, lon: 114.1694, tz: 'Asia/Hong_Kong' },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Seoul', country: 'KR', lat: 37.5665, lon: 126.9780, tz: 'Asia/Seoul' },
  { name: 'Bangkok', country: 'TH', lat: 13.7563, lon: 100.5018, tz: 'Asia/Bangkok' },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Riyadh', country: 'SA', lat: 24.7136, lon: 46.6753, tz: 'Asia/Riyadh' },
  { name: 'Jakarta', country: 'ID', lat: -6.2088, lon: 106.8456, tz: 'Asia/Jakarta' },
  { name: 'Manila', country: 'PH', lat: 14.5995, lon: 120.9842, tz: 'Asia/Manila' },
  { name: 'Kuala Lumpur', country: 'MY', lat: 3.1390, lon: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  { name: 'Taipei', country: 'TW', lat: 25.0330, lon: 121.5654, tz: 'Asia/Taipei' },
  { name: 'Tehran', country: 'IR', lat: 35.6892, lon: 51.3890, tz: 'Asia/Tehran' },
  { name: 'Karachi', country: 'PK', lat: 24.8607, lon: 67.0011, tz: 'Asia/Karachi' },
  { name: 'Lahore', country: 'PK', lat: 31.5204, lon: 74.3587, tz: 'Asia/Karachi' },
  { name: 'Dhaka', country: 'BD', lat: 23.8103, lon: 90.4125, tz: 'Asia/Dhaka' },
  { name: 'Colombo', country: 'LK', lat: 6.9271, lon: 79.8612, tz: 'Asia/Colombo' },
  { name: 'Kathmandu', country: 'NP', lat: 27.7172, lon: 85.3240, tz: 'Asia/Kathmandu' },
  { name: 'Hanoi', country: 'VN', lat: 21.0278, lon: 105.8342, tz: 'Asia/Ho_Chi_Minh' },

  // Middle East / Africa
  { name: 'Cairo', country: 'EG', lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo' },
  { name: 'Nairobi', country: 'KE', lat: -1.2921, lon: 36.8219, tz: 'Africa/Nairobi' },
  { name: 'Lagos', country: 'NG', lat: 6.5244, lon: 3.3792, tz: 'Africa/Lagos' },
  { name: 'Johannesburg', country: 'ZA', lat: -26.2041, lon: 28.0473, tz: 'Africa/Johannesburg' },
  { name: 'Cape Town', country: 'ZA', lat: -33.9249, lon: 18.4241, tz: 'Africa/Johannesburg' },
  { name: 'Casablanca', country: 'MA', lat: 33.5731, lon: -7.5898, tz: 'Africa/Casablanca' },
  { name: 'Addis Ababa', country: 'ET', lat: 9.0250, lon: 38.7469, tz: 'Africa/Addis_Ababa' },
  { name: 'Dar es Salaam', country: 'TZ', lat: -6.7924, lon: 39.2083, tz: 'Africa/Dar_es_Salaam' },

  // Oceania
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'AU', lat: -37.8136, lon: 144.9631, tz: 'Australia/Melbourne' },
  { name: 'Auckland', country: 'NZ', lat: -36.8485, lon: 174.7633, tz: 'Pacific/Auckland' },
  { name: 'Perth', country: 'AU', lat: -31.9505, lon: 115.8605, tz: 'Australia/Perth' },
  { name: 'Brisbane', country: 'AU', lat: -27.4698, lon: 153.0251, tz: 'Australia/Brisbane' },

  // South America
  { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333, tz: 'America/Sao_Paulo' },
  { name: 'Buenos Aires', country: 'AR', lat: -34.6037, lon: -58.3816, tz: 'America/Argentina/Buenos_Aires' },
  { name: 'Rio de Janeiro', country: 'BR', lat: -22.9068, lon: -43.1729, tz: 'America/Sao_Paulo' },
  { name: 'Lima', country: 'PE', lat: -12.0464, lon: -77.0428, tz: 'America/Lima' },
  { name: 'Bogotá', country: 'CO', lat: 4.7110, lon: -74.0721, tz: 'America/Bogota' },
  { name: 'Santiago', country: 'CL', lat: -33.4489, lon: -70.6693, tz: 'America/Santiago' },
  { name: 'Mexico City', country: 'MX', lat: 19.4326, lon: -99.1332, tz: 'America/Mexico_City' },

  // Canada
  { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
  { name: 'Vancouver', country: 'CA', lat: 49.2827, lon: -123.1207, tz: 'America/Vancouver' },
  { name: 'Montreal', country: 'CA', lat: 45.5017, lon: -73.5673, tz: 'America/Toronto' },
  { name: 'Calgary', country: 'CA', lat: 51.0447, lon: -114.0719, tz: 'America/Edmonton' },
];

/**
 * Search cities by name prefix (case-insensitive).
 * Returns top N matches.
 */
export function searchCities(query, maxResults = 10) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return CITIES
    .filter(c => c.name.toLowerCase().includes(q))
    .slice(0, maxResults);
}

/**
 * Find exact city by name (case-insensitive).
 */
export function findCity(name) {
  return CITIES.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
}

export { CITIES };
