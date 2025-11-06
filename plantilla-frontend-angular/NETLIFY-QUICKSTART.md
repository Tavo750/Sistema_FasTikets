# 🚀 Quick Start - Despliegue Netlify

## Archivos Creados

- ✅ `netlify.toml` - Configuración principal de Netlify
- ✅ `.nvmrc` - Versión de Node.js (v18)
- ✅ `_redirects` - Redirecciones para SPA
- ✅ `deploy-netlify.bat` - Script de despliegue para Windows
- ✅ `deploy-netlify.sh` - Script de despliegue para Linux/Mac
- ✅ `.gitignore` actualizado

## 🎯 Despliegue Rápido (3 pasos)

### Opción 1: Desde Git (Recomendado)
```bash
# 1. Sube tu código
git add .
git commit -m "Add Netlify config"
git push

# 2. En Netlify.com:
# - New site from Git
# - Selecciona tu repo
# - Click Deploy (auto-detecta configuración)

# 3. ¡Listo! Tu app estará en: https://tu-sitio.netlify.app
```

### Opción 2: Con CLI de Netlify
```bash
# 1. Instalar CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Desplegar con el script
# En Windows:
deploy-netlify.bat production

# En Linux/Mac:
./deploy-netlify.sh production
```

### Opción 3: Manual
```bash
# 1. Build
npm run build

# 2. En Netlify.com arrastra la carpeta:
# dist/plantilla/browser
```

## ⚙️ Configuración ya incluida

✅ Build automático optimizado para producción  
✅ Redirecciones para Angular Router  
✅ Headers de seguridad  
✅ Cache de assets estáticos  
✅ HTTPS automático  
✅ Node.js v18  

## 🔗 URL de tu sitio
Después del despliegue: `https://[tu-sitio-name].netlify.app`

## 📚 Documentación completa
Ver: `NETLIFY-DEPLOY-GUIDE.md`

---

**Nota**: Netlify NO usa Docker. Despliega archivos estáticos directamente.
