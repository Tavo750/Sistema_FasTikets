# Manejo de Tokens JWT en el Proyecto

## 📋 Resumen
Este documento explica cómo se implementó el manejo automático de tokens JWT en el proyecto Angular.

## 🔧 Componentes Implementados

### 1. **AuthInterceptor** (`core/interceptors/auth.interceptor.ts`)
- **Función**: Intercepta todas las peticiones HTTP y agrega automáticamente el token Bearer
- **Características**:
  - Agrega el header `Authorization: Bearer {token}` a peticiones que requieren autenticación
  - Excluye endpoints públicos (login, registro, etc.)
  - Maneja errores 401 (no autorizado) y 403 (prohibido) automáticamente
  - Redirige al login cuando la sesión expira

### 2. **TokenService** (`core/services/token.service.ts`)
- **Función**: Proporciona utilidades para trabajar con tokens JWT
- **Métodos principales**:
  - `getToken()`: Obtiene el token actual
  - `isTokenValid()`: Verifica si el token no ha expirado
  - `isTokenExpiringSoon()`: Detecta si el token expira en los próximos 5 minutos
  - `decodeTokenPayload()`: Decodifica información del token (solo lectura)

### 3. **TokenGuard** (`core/guards/token.guard.ts`)
- **Función**: Protege rutas que requieren autenticación
- **Características**:
  - Verifica sesión activa antes de permitir acceso a rutas
  - Valida que el token no haya expirado
  - Soporta verificación de roles específicos
  - Muestra advertencias cuando la sesión está por expirar

## 🚀 Cómo Funciona

### Flujo Automático:
1. **Usuario se loguea** → Token se guarda en `SessionService`
2. **Usuario hace petición HTTP** → `AuthInterceptor` agrega automáticamente el header `Authorization: Bearer {token}`
3. **Backend responde** → Si hay error 401/403, el interceptor maneja automáticamente la redirección

### Ejemplo de Petición:
```typescript
// ANTES (manual):
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});
this.http.get(url, { headers });

// AHORA (automático):
this.http.get(url); // El token se agrega automáticamente
```

## 🛡️ Protección de Rutas

### Uso del Guard:
```typescript
const routes: Routes = [
  {
    path: 'administrador',
    canActivate: [TokenGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminComponent
  }
];
```

## 📝 Endpoints Públicos
Los siguientes endpoints NO requieren token:
- `/auth/login`
- `/auth/registro`
- `/auth/recuperar-password`
- `/public/*`

## 🔄 Manejo de Errores Automático

### Errores HTTP manejados:
- **401 (No Autorizado)**: Limpia sesión y redirige a login
- **403 (Prohibido)**: Muestra mensaje de permisos insuficientes
- **0 (Sin conexión)**: Muestra mensaje de error de conexión

## ⚙️ Configuración

### 1. Registrar el Interceptor en `app.module.ts`:
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

### 2. Usar el Guard en las rutas:
```typescript
{
  path: 'ruta-protegida',
  canActivate: [TokenGuard],
  data: { roles: ['ADMIN'] }, // Opcional
  component: ComponenteProtegido
}
```

## 🎯 Beneficios

1. **Automático**: No necesitas agregar manualmente tokens a cada petición
2. **Centralizado**: Todo el manejo de autenticación en un lugar
3. **Seguro**: Manejo automático de tokens expirados y errores de autorización
4. **Flexible**: Fácil configuración de endpoints públicos y roles
5. **UX**: Mensajes automáticos cuando la sesión está por expirar

## 🔍 Casos de Uso

### Servicios (No requieren cambios):
```typescript
// Los servicios funcionan igual, el token se agrega automáticamente
getPerfilAdministrador(id: number): Observable<Response> {
  return this.http.get(`${this.baseUrl}/clientes/${id}/perfil`);
}
```

### Verificar estado del token:
```typescript
constructor(private tokenService: TokenService) {}

checkTokenStatus() {
  if (this.tokenService.isTokenExpiringSoon()) {
    // Mostrar advertencia o renovar token
  }
}
```

## ⚠️ Notas Importantes

1. **El token se obtiene del `SessionService`** que ya está implementado
2. **Los servicios existentes no necesitan modificación** - el interceptor maneja todo automáticamente
3. **Los endpoints públicos están predefinidos** - puedes agregar más si es necesario
4. **El guard es opcional** pero recomendado para rutas sensibles
