#!/bin/bash

# 🚀 Script de démarrage rapide - Trash Detection App
# Ce script démarre l'API backend et l'application React frontend

echo "🚀 Démarrage de Trash Detection App"
echo "===================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier Node.js
echo -e "${BLUE}Vérification de Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo ""

# Vérifier le modèle
echo -e "${BLUE}Vérification du modèle YOLO...${NC}"
if [ ! -f "models/yolo/best.pt" ]; then
    echo -e "${RED}❌ Modèle introuvable: models/yolo/best.pt${NC}"
    echo "Entraînez d'abord le modèle avec 1_yolo_detection_training.ipynb"
    exit 1
fi
echo -e "${GREEN}✅ Modèle trouvé ($(du -h models/yolo/best.pt | cut -f1))${NC}"
echo ""

# Installer les dépendances frontend si nécessaire
if [ ! -d "web-app/node_modules" ]; then
    echo -e "${BLUE}Installation des dépendances frontend...${NC}"
    cd web-app
    npm install
    cd ..
    echo -e "${GREEN}✅ Dépendances installées${NC}"
    echo ""
fi

# Démarrer l'API backend
echo -e "${BLUE}Démarrage de l'API backend...${NC}"
source .venv/bin/activate
python api.py &
API_PID=$!
echo -e "${GREEN}✅ API démarrée (PID: $API_PID)${NC}"
echo -e "   URL: ${GREEN}http://localhost:8000${NC}"
echo -e "   Docs: ${GREEN}http://localhost:8000/docs${NC}"
echo ""

# Attendre que l'API soit prête
echo -e "${BLUE}Attente du démarrage de l'API...${NC}"
sleep 3

# Vérifier que l'API répond
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo -e "${GREEN}✅ API opérationnelle${NC}"
else
    echo -e "${RED}⚠️ L'API ne répond pas encore${NC}"
fi
echo ""

# Démarrer le frontend
echo -e "${BLUE}Démarrage du frontend React...${NC}"
cd web-app
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend démarré (PID: $FRONTEND_PID)${NC}"
echo -e "   URL: ${GREEN}http://localhost:3000${NC}"
echo ""

echo "===================================="
echo -e "${GREEN}🎉 Application lancée avec succès !${NC}"
echo "===================================="
echo ""
echo "📱 Accédez à l'application:"
echo -e "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "📡 API Backend:"
echo -e "   ${BLUE}http://localhost:8000${NC}"
echo -e "   ${BLUE}http://localhost:8000/docs${NC} (documentation)"
echo ""
echo "⏹️  Pour arrêter l'application:"
echo "   Ctrl+C ou exécutez: ./stop-app.sh"
echo ""

# Fonction pour arrêter proprement
cleanup() {
    echo ""
    echo -e "${BLUE}Arrêt de l'application...${NC}"
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Application arrêtée${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Garder le script actif
echo "Appuyez sur Ctrl+C pour arrêter..."
wait
