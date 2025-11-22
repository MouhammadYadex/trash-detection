#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Démarrage de l'application Trash Detection${NC}\n"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "models/yolo/best.pt" ]; then
    echo "❌ Modèle introuvable. Assurez-vous d'être dans le bon répertoire."
    exit 1
fi

# Démarrer l'API en arrière-plan
echo -e "${BLUE}📡 Démarrage du backend API...${NC}"
cd /home/mouhammad/Bureau/nourrou/projet-poubelle/trash_full_detection
source .venv/bin/activate
python api.py > api.log 2>&1 &
API_PID=$!
echo "   ✅ API démarrée (PID: $API_PID) sur http://localhost:8000"

# Attendre que l'API soit prête
sleep 3

# Démarrer le frontend
echo -e "\n${BLUE}🎨 Démarrage du frontend React...${NC}"
cd web-app

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "   📦 Installation des dépendances npm..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "   ✅ Frontend démarré (PID: $FRONTEND_PID) sur http://localhost:3000"

echo -e "\n${GREEN}✅ Application lancée avec succès !${NC}"
echo -e "\n📍 Accès:"
echo -e "   Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "   API:      ${BLUE}http://localhost:8000${NC}"
echo -e "   Swagger:  ${BLUE}http://localhost:8000/docs${NC}"
echo -e "\n⏹️  Pour arrêter: kill $API_PID $FRONTEND_PID"
echo -e "   ou: ./stop-app.sh\n"

# Garder le script actif
wait
