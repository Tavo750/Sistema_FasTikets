# 🚀 Guía de Despliegue en Netlify - FasTikets Angular App

## 📋 Requisitos Previos

- Cuenta en [Netlify](https://www.netlify.com/)
- Repositorio Git (GitHub, GitLab o Bitbucket)
- Node.js 18 o superior instalado localmente

## 🔧 Archivos de Configuración Creados

### 1. `netlify.toml`
Archivo principal de configuración de Netlify que incluye:
- **Comando de build**: `npm run build`
- **Directorio de publicación**: `dist/plantilla/browser`
- **Versión de Node.js**: 18
- **Redirecciones SPA**: Para que Angular Router funcione correctamente
- **Headers de seguridad**: X-Frame-Options, X-XSS-Protection, etc.
- **Cache de assets**: Optimización de carga de archivos estáticos

### 2. `.nvmrc`
Especifica la versión de Node.js para el despliegue (v18)

### 3. `_redirects`
Archivo alternativo de redirecciones (respaldo)

### 4. `.gitignore`
Actualizado con exclusiones de Netlify

## 🌐 Métodos de Despliegue

### Opción 1: Despliegue desde Git (Recomendado)

1. **Sube tu código a GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Conecta tu repositorio en Netlify**
   - Ingresa a [Netlify](https://app.netlify.com/)
   - Click en "Add new site" > "Import an existing project"
   - Selecciona tu proveedor Git (GitHub, GitLab, etc.)
   - Autoriza el acceso y selecciona el repositorio

3. **Configuración automática**
   - Netlify detectará automáticamente la configuración del `netlify.toml`
   - Verifica que los valores sean:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist/plantilla/browser`
     - **Node version**: 18

4. **Deploy**
   - Click en "Deploy site"
   - Espera 2-5 minutos mientras se construye y despliega

### Opción 2: Despliegue Manual con Netlify CLI

1. **Instala Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login en Netlify**
   ```bash
   netlify login
   ```

3. **Construye la aplicación localmente**
   ```bash
   npm run build
   ```

4. **Despliega**
   ```bash
   # Despliegue de prueba
   netlify deploy

   # Despliegue a producción
   netlify deploy --prod
   ```

### Opción 3: Drag & Drop (Para pruebas rápidas)

1. **Construye localmente**
   ```bash
   npm run build
   ```

2. **Arrastra la carpeta**
   - Ve a [Netlify Drop](https://app.netlify.com/drop)
   - Arrastra la carpeta `dist/plantilla/browser` al navegador

## ⚙️ Configuración de Variables de Entorno

Si tu aplicación usa variables de entorno:

1. En Netlify Dashboard, ve a: **Site settings > Environment variables**
2. Agrega las variables necesarias:
   ```
   API_URL=https://tu-api.com
   PRODUCTION=true
   ```

3. Crea archivos de entorno para Netlify:
   ```typescript
   // src/app/core/environment/environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://tu-api-produccion.com'
   };
   ```

## 🔄 Actualizaciones Automáticas

Con el despliegue desde Git, cada push a tu rama principal activará:
- ✅ Build automático
- ✅ Tests (si están configurados)
- ✅ Despliegue automático
- ✅ Preview deployments para PRs

## 🛠️ Comandos Útiles de Netlify CLI

```bash
# Ver status del sitio
netlify status

# Abrir el sitio en el navegador
netlify open

# Ver logs del último despliegue
netlify logs

# Enlazar proyecto local con sitio Netlify
netlify link

# Configurar variables de entorno
netlify env:set VARIABLE_NAME value
```

## 🔍 Solución de Problemas

### Error: "Page Not Found" en rutas de Angular
- ✅ **Solución**: El archivo `netlify.toml` ya incluye las redirecciones necesarias
- Verifica que la configuración `[[redirects]]` esté presente

### Error: Build fallido
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que la versión de Node.js sea compatible
- Revisa los logs en Netlify Dashboard

### Error: Assets no se cargan
- Verifica que las rutas en tu código sean relativas
- Asegúrate de que los assets estén en la carpeta `public/`
- Revisa la configuración de `assets` en `angular.json`

### Error: API CORS
- Configura proxies en `netlify.toml`:
  ```toml
  [[redirects]]
    from = "/api/*"
    to = "https://tu-backend.com/api/:splat"
    status = 200
    force = true
  ```

## 📊 Funciones Avanzadas

### Domain Personalizado
1. En Netlify: **Domain settings > Add custom domain**
2. Configura los DNS según las instrucciones

### HTTPS Automático
- Netlify proporciona SSL/TLS automático con Let's Encrypt

### Branch Deploys
- Despliega diferentes ramas en subdominios
- Configuración: **Build & deploy > Deploy contexts**

### Split Testing (A/B Testing)
- Prueba diferentes versiones de tu app
- Configuración: **Split Testing** en el dashboard

## 📈 Monitoreo y Analytics

Netlify ofrece:
- 📊 Analytics de tráfico
- 🚨 Alertas de errores
- 📈 Métricas de rendimiento
- 🔍 Logs detallados

## 🎯 Checklist de Despliegue

- [ ] Código subido a Git
- [ ] `netlify.toml` configurado
- [ ] Variables de entorno configuradas (si aplica)
- [ ] Build local exitoso (`npm run build`)
- [ ] Sitio conectado en Netlify
- [ ] Primer despliegue exitoso
- [ ] Rutas de Angular funcionando
- [ ] Assets cargando correctamente
- [ ] Domain personalizado configurado (opcional)
- [ ] HTTPS habilitado

## 🔗 Enlaces Útiles

- [Documentación oficial de Netlify](https://docs.netlify.com/)
- [Netlify CLI Docs](https://cli.netlify.com/)
- [Angular Deployment Guide](https://angular.dev/tools/cli/deployment)
- [Netlify Community Forum](https://answers.netlify.com/)

## 💡 Tips de Optimización

1. **Reduce el tamaño del bundle**
   ```bash
   npm run build -- --configuration production
   ```

2. **Habilita el lazy loading** en tus módulos Angular

3. **Optimiza imágenes** antes de subirlas

4. **Usa el Angular Service Worker** para PWA

5. **Configura prerendering** para mejor SEO

---

¡Tu aplicación Angular ahora está lista para desplegarse en Netlify! 🎉
