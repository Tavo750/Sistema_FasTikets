# ⚠️ ATENCIÓN: Componentes con Leaflet Pendientes

## 🚨 Problema Detectado

Durante la migración a Google Maps, se detectaron otros componentes que aún utilizan **Leaflet** y necesitan ser actualizados:

### 📁 Componentes Afectados:

1. **📍 Editar Local**
   - `src/app/pages/modules/administrador/components/gestion-locales/editar-local/editar-local.component.ts`

2. **🎫 Evento Component**
   - `src/app/pages/modules/home/inicio/components/evento/evento.component.ts`

## 🔧 Acciones Requeridas

Para completar la migración, estos componentes también deben ser actualizados para usar **Google Maps** en lugar de **Leaflet**.

### ⚡ Solución Temporal

Si necesitas compilar el proyecto inmediatamente, puedes:

1. **Reinstalar Leaflet temporalmente**:
   ```bash
   npm install leaflet @types/leaflet leaflet-defaulticon-compatibility
   ```

2. **Agregar estilos de Leaflet de vuelta en angular.json**:
   ```json
   "styles": [
     "src/styles.css",
     "node_modules/bootstrap/dist/css/bootstrap.min.css", 
     "node_modules/primeicons/primeicons.css",
     "node_modules/leaflet/dist/leaflet.css"
   ]
   ```

### 🎯 Solución Definitiva (Recomendada)

Migrar los componentes restantes a Google Maps siguiendo el mismo patrón usado en `crear-local.component.ts`.

## 📋 Lista de Verificación

- ✅ **crear-local.component.ts** - ✓ Migrado a Google Maps
- ❌ **editar-local.component.ts** - Pendiente migración
- ❌ **evento.component.ts** - Pendiente migración

## 🚀 Próximos Pasos

1. Migrar `editar-local.component.ts` a Google Maps
2. Migrar `evento.component.ts` a Google Maps  
3. Remover completamente las dependencias de Leaflet
4. Actualizar documentación

---

**Estado actual**: El componente `crear-local` ya usa Google Maps, pero la compilación falla por componentes pendientes.