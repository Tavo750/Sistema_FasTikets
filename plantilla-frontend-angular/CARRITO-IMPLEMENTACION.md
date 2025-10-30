# Implementación del Sistema de Carrito de Compras

## Resumen de Funcionalidad

Se implementó un sistema completo de carrito de compras que conecta el componente de eventos con el carrito, permitiendo añadir entradas seleccionadas y mantener el estado del carrito en toda la aplicación.

## Archivos Creados/Modificados

### 1. **CartService** - Servicio Principal del Carrito
**Archivo:** `src/app/shared/services/cart.service.ts`

**Funcionalidades:**
- Gestión centralizada del estado del carrito
- Persistencia en localStorage
- Observables para reactividad en tiempo real
- Métodos para añadir, eliminar y actualizar items
- Cálculos automáticos de totales

**Métodos principales:**
- `addEventTicketsToCart()`: Añade tickets de eventos al carrito
- `removeItem()`: Elimina un item del carrito
- `updateQuantity()`: Actualiza la cantidad de un item
- `getTotalItems()`: Obtiene el total de items
- `getTotalPrice()`: Calcula el precio total

### 2. **EventoComponent** - Componente de Evento Actualizado
**Archivo:** `src/app/pages/modules/home/inicio/components/evento/evento.component.ts`

**Cambios implementados:**
- Integración con CartService
- Integración con MessageService para notificaciones
- Método `onAddToCart()` actualizado para usar el servicio
- Método `resetTicketQuantities()` para limpiar selección
- Notificaciones toast de éxito/advertencia

**Funcionalidad:**
- Al hacer clic en "Añadir al Carrito", los tickets seleccionados se añaden al carrito
- Muestra notificaciones de confirmación
- Valida que se hayan seleccionado tickets antes de añadir

### 3. **CarritoCompraComponent** - Componente del Carrito Actualizado
**Archivo:** `src/app/pages/modules/home/inicio/components/carrito-compra/carrito-compra.component.ts`

**Cambios implementados:**
- Suscripción en tiempo real al CartService
- Eliminación de datos estáticos de prueba
- Métodos actualizados para usar el servicio
- Gestión automática del estado

**Funcionalidad:**
- Los items se cargan automáticamente desde el servicio
- Cambios en tiempo real cuando se añaden/eliminan items
- Cálculos dinámicos de subtotales y totales

### 4. **HeaderComponent** - Header con Contador de Carrito
**Archivo:** `src/app/core/components/header/header.component.ts`

**Cambios implementados:**
- Integración con CartService
- Contador dinámico de items del carrito
- Suscripción a cambios del carrito

**Archivo:** `src/app/core/components/header/header.component.html`
- Badge visual que muestra el número de items en el carrito

**Archivo:** `src/app/core/components/header/header.component.css`
- Estilos para el badge del carrito (color naranja para diferenciarlo de notificaciones)

### 5. **HomeModule** - Módulo Actualizado
**Archivo:** `src/app/pages/modules/home/home.module.ts`

**Cambios implementados:**
- Importación de MessageService
- Proveedor de MessageService añadido

### 6. **Templates Actualizados**

**evento.component.html:**
- Añadido componente `<p-toast>` para mostrar notificaciones

**carrito-compra.component.html:**
- Actualizado formato de moneda de USD a Soles Peruanos (S/)
- Consistencia con el formato del componente evento

## Flujo de Funcionamiento

### 1. Selección de Tickets en Evento
```typescript
// Usuario selecciona tickets usando los botones +/-
increment(ticket) { ticket.quantity++; }
decrement(ticket) { if (ticket.quantity > 0) ticket.quantity--; }
```

### 2. Añadir al Carrito
```typescript
onAddToCart() {
  // 1. Filtrar tickets con cantidad > 0
  const selectedTickets = this.tickets.filter(t => t.quantity > 0);
  
  // 2. Validar que haya selección
  if (selectedTickets.length === 0) {
    // Mostrar advertencia
    return;
  }
  
  // 3. Preparar información del evento
  const eventInfo = {
    title: this.title,
    image: this.imageUrl,
    date: this.date,
    venue: this.venue
  };
  
  // 4. Añadir al carrito usando el servicio
  this.cartService.addEventTicketsToCart(selectedTickets, eventInfo);
  
  // 5. Mostrar notificación de éxito
  // 6. Limpiar selección (opcional)
}
```

### 3. Actualización Automática del Carrito
```typescript
// El CarritoCompraComponent se suscribe automáticamente
ngOnInit() {
  this.cartSubscription = this.cartService.getCartItems$().subscribe(
    (items: CartItem[]) => {
      this.cartItems = items; // Actualización automática
    }
  );
}
```

### 4. Contador en Header
```typescript
// El Header muestra el número total de items
this.cartSubscription = this.cartService.getCartItems$().subscribe(items => {
  this.cartItemCount = this.cartService.getTotalItems();
});
```

## Características Principales

### ✅ Persistencia
- Los datos del carrito se guardan en localStorage
- El carrito se mantiene entre sesiones del navegador

### ✅ Reactividad
- Todos los componentes se actualizan automáticamente
- Uso de Observables para sincronización en tiempo real

### ✅ Validaciones
- No permite añadir sin seleccionar tickets
- Valida cantidades mínimas y máximas

### ✅ UX Mejorada
- Notificaciones toast para confirmaciones
- Contador visual en el header
- Formato de moneda consistente (Soles Peruanos)

### ✅ Gestión de Estado
- Estado centralizado en el servicio
- Métodos para todas las operaciones CRUD del carrito

## Próximos Pasos Sugeridos

1. **Integración con Backend**: Conectar el carrito con una API para persistencia en servidor
2. **Autenticación**: Asociar carritos con usuarios específicos
3. **Validación de Stock**: Verificar disponibilidad de entradas antes de añadir
4. **Checkout Process**: Implementar el flujo completo de pago
5. **Carrito Compartido**: Permitir compartir carritos entre dispositivos del mismo usuario

## Uso de la Funcionalidad

Para que un usuario añada tickets al carrito:

1. Va al componente de evento (`/home/evento`)
2. Selecciona la cantidad de tickets deseados usando los botones +/-
3. Hace clic en "Añadir al Carrito"
4. Ve una notificación de confirmación
5. El contador del header se actualiza automáticamente
6. Puede ver sus items en el carrito (`/home/compraEntradas`)
7. Los items persisten en localStorage entre sesiones
