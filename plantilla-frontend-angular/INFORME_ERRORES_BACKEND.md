# 🚨 INFORME DE ERRORES DEL BACKEND - ENDPOINTS DASHBOARD

## Resumen Ejecutivo
Los endpoints del dashboard están presentando errores críticos que requieren atención inmediata del equipo de backend.

---

## 📊 ESTADO DE ENDPOINTS

### ❌ ENDPOINT 1: Eventos Populares
**URL:** `GET /api/v1/eventos/populares/3`
**Estado:** FALLANDO ❌
**Error:** `Query did not return a unique result: 2 results were returned`
**Prioridad:** 🔴 ALTA

### ❌ ENDPOINT 2: Ventas Totales  
**URL:** `GET /api/v1/eventos/ventas`
**Estado:** FALLANDO ❌
**Error:** `Cannot invoke "java.lang.Double.doubleValue()" because the return value of "pe.edu.pucp.fasticket.repository.eventos.TipoTicketRepositorio.sumIngresosByEventoId(java.lang.Integer)" is null`
**Prioridad:** 🔴 ALTA

---

## 🔧 SOLUCIONES PROPUESTAS

### Para Eventos Populares
```sql
-- OPCIÓN 1: Agregar DISTINCT
SELECT DISTINCT e.id, e.nombre, COUNT(*) as total_ventas
FROM eventos e 
JOIN tickets t ON e.id = t.evento_id
GROUP BY e.id, e.nombre
ORDER BY total_ventas DESC
LIMIT 3;

-- OPCIÓN 2: Usar window function
SELECT * FROM (
    SELECT e.*, 
           ROW_NUMBER() OVER (PARTITION BY e.id ORDER BY e.fecha_creacion DESC) as rn
    FROM eventos e
    WHERE e.estado = 'ACTIVO'
) ranked WHERE rn = 1
ORDER BY total_ventas DESC
LIMIT 3;
```

### Para Ventas Totales
```java
// En TipoTicketRepositorio.java
@Query("SELECT COALESCE(SUM(tt.precio * t.cantidad), 0.0) FROM TipoTicket tt " +
       "JOIN Ticket t ON tt.id = t.tipoTicket.id " + 
       "WHERE tt.evento.id = :eventoId")
Double sumIngresosByEventoId(@Param("eventoId") Integer eventoId);

// O manejar null en el servicio:
public Double getIngresosTotales(Integer eventoId) {
    Double ingresos = tipoTicketRepositorio.sumIngresosByEventoId(eventoId);
    return ingresos != null ? ingresos : 0.0;
}
```

---

## 📋 PLAN DE ACCIÓN

### ✅ FRONTEND (COMPLETADO)
- ✅ Implementado manejo robusto de errores
- ✅ Fallbacks funcionales para ambos endpoints  
- ✅ Mensajes informativos al usuario
- ✅ Dashboard funcional durante problemas de backend

### 🔧 BACKEND (PENDIENTE)
1. **Inmediato:** Revisar query de eventos populares
2. **Inmediato:** Validar nulls en cálculo de ventas
3. **Testing:** Probar con diferentes valores de topN
4. **Validación:** Asegurar integridad de datos en BD

---

## 🧪 CASOS DE PRUEBA

### Eventos Populares
```bash
# Probar diferentes valores
curl -X GET "/api/v1/eventos/populares/1"
curl -X GET "/api/v1/eventos/populares/3"  
curl -X GET "/api/v1/eventos/populares/5"
```

### Ventas Totales
```bash
# Probar con eventos que tienen/no tienen ventas
curl -X GET "/api/v1/eventos/ventas"
curl -X GET "/api/v1/eventos/1/ventas" 
```

---

## 📞 CONTACTO
**Reportado por:** Frontend Team  
**Fecha:** 30 de noviembre de 2025  
**Urgencia:** Crítica - Afecta dashboard principal

**Estado del Frontend:** ✅ Funcional con fallbacks implementados  
**Acción Requerida:** 🔧 Corrección inmediata en backend