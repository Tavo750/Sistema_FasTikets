#!/bin/bash

# Script de despliegue automatizado para Netlify
# Ejecuta: ./deploy-netlify.sh [preview|production]

echo "🚀 Iniciando despliegue a Netlify..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si Netlify CLI está instalado
if ! command -v netlify &> /dev/null
then
    echo -e "${RED}❌ Netlify CLI no está instalado${NC}"
    echo -e "${YELLOW}Instalando Netlify CLI...${NC}"
    npm install -g netlify-cli
fi

# Limpiar directorio de build anterior
echo -e "${YELLOW}🧹 Limpiando build anterior...${NC}"
if [ -d "dist" ]; then
    rm -rf dist
fi

# Construir la aplicación
echo -e "${YELLOW}📦 Construyendo aplicación...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completado exitosamente${NC}"

# Determinar tipo de despliegue
DEPLOY_TYPE=${1:-preview}

if [ "$DEPLOY_TYPE" = "production" ] || [ "$DEPLOY_TYPE" = "prod" ]; then
    echo -e "${YELLOW}🌐 Desplegando a PRODUCCIÓN...${NC}"
    netlify deploy --prod --dir=dist/plantilla/browser
else
    echo -e "${YELLOW}🔍 Desplegando PREVIEW...${NC}"
    netlify deploy --dir=dist/plantilla/browser
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Despliegue exitoso!${NC}"
else
    echo -e "${RED}❌ Error en el despliegue${NC}"
    exit 1
fi
