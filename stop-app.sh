#!/bin/bash

# Script pour arrêter l'application

echo "🛑 Arrêt de Trash Detection App..."

# Tuer les processus sur les ports
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "✅ Application arrêtée"
