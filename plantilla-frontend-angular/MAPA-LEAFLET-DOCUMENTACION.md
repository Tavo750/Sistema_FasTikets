# Implementación del Mapa con Leaflet

## Descripción
Se ha implementado un mapa interactivo usando Leaflet en el componente `crear-local` que permite a los usuarios seleccionar la ubicación geográfica del local mediante:

## Funcionalidades Implementadas

### 1. Mapa Interactivo
- **Mapa base**: OpenStreetMap
- **Zoom inicial**: 13 (centrado en Lima, Perú)
- **Coordenadas por defecto**: Lima (-12.0464, -77.0428)

### 2. Selección de Ubicación
- **Clic en el mapa**: Coloca el marcador en la posición clicada
- **Arrastre del marcador**: Permite mover el marcador arrastrándolo
- **Actualización automática**: Las coordenadas se actualizan en tiempo real en el formulario

### 3. Integración con Distritos
- **Centrado automático**: Al seleccionar un distrito, el mapa se centra en esa zona
- **Botón de centrado**: Botón adicional para centrar manualmente el mapa en el distrito
- **Coordenadas predefinidas**: Para Santiago de Surco, San Juan de Miraflores y Jesús María

### 4. Información de Coordenadas
- **Visualización en tiempo real**: Muestra latitud y longitud actuales
- **Formato decimal**: Coordenadas con 6 decimales de precisión
- **Instrucciones de uso**: Texto informativo para el usuario

## Archivos Modificados

### 1. `crear-local.component.ts`
- Importación de Leaflet
- Configuración de iconos por defecto
- Métodos de inicialización y manejo del mapa
- Integración con el formulario reactivo
- Método `centerMapOnDistrict()` para centrar por distrito
- Manejo de eventos de clic y arrastre

### 2. `crear-local.component.html`
- Reemplazo del placeholder del mapa con div funcional
- Información de coordenadas en tiempo real
- Botón para centrar por distrito
- Instrucciones de uso

### 3. `crear-local.component.css`
- Estilos para el contenedor del mapa
- Estilos para la información de coordenadas
- Estilos para el botón de distrito
- Responsive design

### 4. `angular.json`
- Inclusión del CSS de Leaflet en los estilos globales

### 5. Assets
- Copia de iconos de marcadores de Leaflet (`marker-icon.png`, `marker-icon-2x.png`, `marker-shadow.png`)

## Dependencias
- **leaflet**: ^1.9.4 (ya estaba instalada)
- **@types/leaflet**: Instalada para soporte de TypeScript

## Datos del Formulario
El formulario ahora incluye dos campos adicionales:
- `latitud`: Coordenada de latitud seleccionada
- `longitud`: Coordenada de longitud seleccionada

## Uso
1. El mapa se carga automáticamente al abrir el componente
2. Seleccionar un distrito centrará automáticamente el mapa en esa zona
3. Hacer clic en cualquier punto del mapa colocará el marcador allí
4. Arrastrar el marcador permite ajustar la posición con precisión
5. Las coordenadas se muestran en tiempo real y se guardan en el formulario
6. Al crear el local, las coordenadas se incluyen en los datos enviados

## Notas Técnicas
- Se utiliza OpenStreetMap como proveedor de tiles (gratuito)
- Los iconos se configuran correctamente para evitar problemas de visualización
- El mapa se destruye correctamente cuando el componente se desmonta
- Manejo de errores y mensajes informativos con PrimeNG Toast
