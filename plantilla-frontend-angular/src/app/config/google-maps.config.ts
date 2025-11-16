/**
 * Configuración de Google Maps
 * 
 * Para usar Google Maps, necesitas obtener una API key de Google Cloud Console:
 * 1. Ve a https://console.cloud.google.com/
 * 2. Crea un proyecto o selecciona uno existente
 * 3. Habilita la API de Maps JavaScript API y Places API
 * 4. Crea credenciales (API Key)
 * 5. Reemplaza 'YOUR_API_KEY' con tu clave real
 * 
 * IMPORTANTE: Restringe tu API key por dominio en producción
 */

export const GOOGLE_MAPS_CONFIG = {
  // API key configurada de Google Maps
  apiKey: 'AIzaSyDxlNW8juV4SV82sHnmeBcpdmRSiER0O-Y',
  
  // Librerías necesarias
  libraries: ['places', 'geometry'],
  
  // Configuración del mapa por defecto
  defaultMapOptions: {
    zoom: 13,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    gestureHandling: 'cooperative'
  },
  
  // Coordenadas por defecto (Lima, Perú)
  defaultCenter: {
    lat: -12.0464,
    lng: -77.0428
  }
};