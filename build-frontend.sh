#!/bin/bash

echo "🏗️ Build du frontend React..."

# Aller dans le dossier web-app
cd web-app

# Installer les dépendances
echo "📦 Installation des dépendances npm..."
npm install

# Build production
echo "⚙️ Build production avec Vite..."
npm run build

# Copier le build dans un dossier accessible
echo "📁 Déplacement du build..."
mkdir -p ../static
cp -r dist/* ../static/

echo "✅ Build terminé ! Les fichiers sont dans static/"
