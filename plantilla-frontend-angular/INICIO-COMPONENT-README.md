# Pantalla de Inicio - Sistema FasTikets

## Descripción
La pantalla de inicio ha sido completamente modernizada para mostrar eventos de conciertos y venta de entradas usando componentes de PrimeNG con una paleta de colores basada en rojo y blanco.

## Características Implementadas

### 🎨 Diseño Visual
- **Paleta de colores**: Rojo (#dc2626), blanco, gris oscuro y colores complementarios
- **Hero section** con gradiente rojo y información destacada
- **Cards modernas** con efectos hover y animaciones
- **Responsive design** para todos los dispositivos
- **Animaciones CSS** para mejorar la experiencia del usuario

### 🔧 Componentes PrimeNG Utilizados
- **p-card**: Para mostrar eventos de forma elegante
- **p-dropdown**: Filtros de categoría, ubicación y ordenamiento
- **p-calendar**: Selector de fechas
- **p-button**: Botones de acción estilizados
- **p-tag**: Etiquetas de categorías con colores
- **p-panel**: Panel colapsible para filtros
- **p-paginator**: Paginación moderna

### 📊 Funcionalidades
- **Filtrado avanzado**: Por categoría, ubicación, fecha
- **Ordenamiento**: Por precio, nombre, fecha, relevancia
- **Paginación inteligente**: Con información de registros
- **Estadísticas rápidas**: Contador de eventos, ubicaciones y categorías
- **Búsqueda visual**: Cards con imágenes y información destacada
- **Limpieza de filtros**: Botón para resetear todos los filtros

### 🎵 Categorías de Eventos
- Rock
- Rock and Pop
- Reggae
- Pop
- Punk
- Reguetón
- Jazz

### 🏢 Ubicaciones Disponibles
- Arena 1 - Cúpula
- Arena 2
- Arena 3
- Movistar Arena

## Estructura de Archivos Modificados

```
src/app/pages/modules/home/inicio/
├── inicio.component.html    # Template modernizado con PrimeNG
├── inicio.component.ts      # Lógica mejorada con filtros y ordenamiento
└── inicio.component.css     # Estilos modernos con paleta rojo/blanco
```

## Paleta de Colores

```css
--primary-red: #dc2626     /* Rojo principal */
--light-red: #ef4444       /* Rojo claro */
--dark-red: #b91c1c        /* Rojo oscuro */
--white: #ffffff           /* Blanco */
--light-gray: #f8fafc      /* Gris claro */
--medium-gray: #64748b     /* Gris medio */
--dark-gray: #1e293b       /* Gris oscuro */
--accent-coral: #fb7185    /* Coral complementario */
--accent-rose: #f43f5e     /* Rosa complementario */
```

## Responsive Breakpoints

- **Desktop**: > 768px (Grid de 3-4 columnas)
- **Tablet**: 768px - 480px (Grid de 2 columnas)
- **Mobile**: < 480px (Grid de 1 columna)

## Imágenes de Eventos

Actualmente usando placeholders de https://via.placeholder.com. Para usar imágenes reales:

1. Crear carpeta: `src/assets/img/eventos/`
2. Agregar imágenes con formato 400x200px
3. Actualizar rutas en `inicio.component.ts`:

```typescript
// Cambiar de:
imagen: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=UB40'
// A:
imagen: 'assets/img/eventos/ub40.jpg'
```

## Funcionalidades Adicionales Implementadas

### 🔍 Sistema de Filtros
- Filtro por categoría con dropdown
- Filtro por ubicación
- Filtro por fecha (con calendario)
- Ordenamiento múltiple

### 📱 Responsive Design
- Diseño adaptativo para móviles
- Cards que se reorganizan según el tamaño de pantalla
- Navegación táctil optimizada

### ⚡ Optimizaciones de Rendimiento
- Lazy loading de imágenes
- Animaciones optimizadas con CSS
- Paginación para manejar grandes cantidades de eventos

### 🎯 UX/UI Mejoras
- Estados de hover interactivos
- Feedback visual en botones
- Animaciones de entrada escalonadas
- Iconografía consistente

## Próximas Mejoras Sugeridas

1. **Integración con API**: Conectar con backend real
2. **Búsqueda por texto**: Agregar campo de búsqueda
3. **Filtros avanzados**: Rango de precios, distancia
4. **Favoritos**: Permitir marcar eventos favoritos
5. **Compartir**: Botones de redes sociales
6. **Reservas**: Sistema de reserva de entradas
7. **Notificaciones**: Alertas de nuevos eventos

## Dependencias Requeridas

- Angular 15+
- PrimeNG 17+
- PrimeIcons
- FormsModule (ya incluido)

## Instalación de Imágenes Recomendadas

Para obtener mejores resultados visuales, se recomienda usar imágenes de eventos reales con:
- Dimensiones: 400x200px
- Formato: JPG o WebP
- Optimizadas para web (< 100KB)
- Con temática musical/conciertos
