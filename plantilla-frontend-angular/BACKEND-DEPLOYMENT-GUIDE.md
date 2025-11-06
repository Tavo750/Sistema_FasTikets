# 🔗 Configuración Backend + Frontend en Netlify

## 📊 Tu Stack Actual

**Backend (Docker Local):**
- 🐘 PostgreSQL: `localhost:5433`
- 🔴 Redis: `localhost:6379`
- ⚡ FastTicket API: `localhost:8081`

**Frontend:**
- 🅰️ Angular → Netlify

---

## 🚀 Opciones para Conectar Backend con Frontend

### ✅ Opción 1: Desplegar Backend en la Nube (RECOMENDADO)

Tu backend necesita estar accesible públicamente para que el frontend en Netlify pueda comunicarse.

#### **Railway.app** (Más fácil, soporta Docker)

1. **Instalar Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Preparar tu backend:**
   Asegúrate de tener un `Dockerfile` en tu carpeta backend

3. **Desplegar:**
   ```bash
   cd ruta/al/backend
   railway login
   railway init
   railway up
   ```

4. **Railway creará automáticamente:**
   - ✅ PostgreSQL
   - ✅ Redis
   - ✅ Tu API con URL pública
   
5. **Obtener URL:**
   Railway te dará una URL como: `https://tu-app.railway.app`

#### **Render.com** (Alternativa con plan gratuito)

1. Conecta tu repositorio en [render.com](https://render.com)
2. Crea 3 servicios:
   - PostgreSQL Database
   - Redis
   - Web Service (tu backend)
3. Render auto-detecta Docker y despliega

#### **Fly.io** (Excelente para Docker)

```bash
# Instalar Fly CLI
# Windows: https://fly.io/docs/hands-on/install-flyctl/

# Login
fly auth login

# Deploy
cd ruta/al/backend
fly launch
fly deploy
```

---

### ⚙️ Opción 2: Exponer Backend Local (Solo para desarrollo/testing)

#### **Con ngrok:**

```bash
# Descargar e instalar: https://ngrok.com/download

# Exponer puerto 8081
ngrok http 8081
```

Te dará una URL temporal como: `https://abc-123-xyz.ngrok-free.app`

⚠️ **Limitaciones:**
- URL cambia cada vez que reinicias ngrok
- Requiere mantener tu PC encendida
- Versión gratuita tiene límites

#### **Con Cloudflare Tunnel:**

```bash
# Instalar cloudflared
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Crear tunnel
cloudflared tunnel --url http://localhost:8081
```

---

## 🔧 Configurar URL del Backend en Angular

### Paso 1: Variables de Entorno en Netlify

Una vez que tengas tu backend desplegado (ej: `https://tu-api.railway.app`):

1. Ve a tu sitio en Netlify
2. **Site settings** → **Environment variables**
3. Agrega:
   ```
   BACKEND_URL = https://tu-api.railway.app/api/v1
   ```

### Paso 2: Actualizar environment.prod.ts

Ya creé el archivo: `src/app/core/environment/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  useMockAuth: false,
  baseUrl: 'https://TU_BACKEND_URL/api/v1'
};
```

**Actualiza `TU_BACKEND_URL`** con tu URL real cuando despliegues el backend.

### Paso 3: Actualizar global.ts (si lo usas)

Si tu app usa `global.ts`, actualiza también:

```typescript
// Para producción
export var baseUrl = 'https://tu-api.railway.app/api/v1'
```

---

## 🔐 Configuración CORS en el Backend

Tu backend necesita permitir requests desde Netlify:

```javascript
// Ejemplo en Node.js/Express
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:4200', // Desarrollo
    'https://tu-sitio.netlify.app' // Producción
  ],
  credentials: true
}));
```

---

## 📝 Checklist de Despliegue Completo

### Backend:
- [ ] Elegir plataforma (Railway/Render/Fly.io)
- [ ] Desplegar PostgreSQL
- [ ] Desplegar Redis
- [ ] Desplegar API
- [ ] Obtener URL pública del API
- [ ] Configurar CORS
- [ ] Probar endpoints con Postman/Thunder Client

### Frontend:
- [ ] Actualizar `environment.prod.ts` con URL del backend
- [ ] Configurar variable de entorno en Netlify (opcional)
- [ ] Commit y push a Git
- [ ] Verificar build en Netlify
- [ ] Probar la aplicación en producción

---

## 🧪 Probar Conexión

Una vez desplegado todo:

1. **Abre tu sitio Netlify:** `https://tu-sitio.netlify.app`
2. **Abre DevTools:** F12 → Network
3. **Intenta hacer login o alguna operación**
4. **Verifica:** Las requests deben ir a tu backend en Railway/Render/Fly

---

## 💡 Tips

### Para Desarrollo Local:
```typescript
// environment.ts (desarrollo)
baseUrl: 'http://localhost:8081/api/v1'
```

### Para Producción:
```typescript
// environment.prod.ts (producción)
baseUrl: 'https://tu-api.railway.app/api/v1'
```

### Usar variables de entorno dinámicas:
```typescript
// environment.prod.ts
baseUrl: (window as any).env?.BACKEND_URL || 'https://default-api.com/api/v1'
```

---

## 🆘 Problemas Comunes

### Error: CORS
**Solución:** Configurar CORS en el backend para permitir tu dominio Netlify

### Error: Connection refused
**Solución:** Verificar que el backend esté accesible públicamente

### Error: SSL/TLS
**Solución:** Usar HTTPS en ambos (frontend y backend)

### Backend duerme (Render/Railway plan gratuito)
**Solución:** Primera request puede tardar ~30s mientras despierta

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

**Siguiente paso:** ¿Qué plataforma prefieres para desplegar el backend?
