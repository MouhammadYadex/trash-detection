# 🚀 Application Web React - Trash Detection AI

Application React professionnelle pour la détection de poubelles pleines/vides avec YOLOv8.

## 📋 Architecture

```
web-app/
├── src/
│   ├── components/          # Composants réutilisables
│   │   └── Layout.jsx      # Layout principal avec navigation
│   ├── pages/              # Pages de l'application
│   │   ├── HomePage.jsx    # Page d'accueil
│   │   ├── UploadPage.jsx  # Upload et détection
│   │   ├── HistoryPage.jsx # Historique des détections
│   │   ├── StatsPage.jsx   # Statistiques et graphiques
│   │   └── AboutPage.jsx   # À propos du projet
│   ├── App.jsx             # Composant racine
│   ├── main.jsx            # Point d'entrée
│   └── index.css           # Styles globaux (Tailwind)
├── public/                 # Fichiers statiques
├── index.html              # HTML principal
├── package.json            # Dépendances
├── vite.config.js         # Configuration Vite
├── tailwind.config.js     # Configuration Tailwind CSS
└── postcss.config.js      # Configuration PostCSS
```

## 🎯 Fonctionnalités

### ✅ Pages Implémentées

1. **Page d'accueil** (`/`)
   - Hero section avec gradient
   - Statistiques en temps réel
   - Présentation des fonctionnalités
   - Guide d'utilisation

2. **Détection** (`/upload`)
   - Drag & drop d'images
   - Prévisualisation
   - Détection en temps réel
   - Résultats avec bounding boxes
   - Export JSON des détections
   - Téléchargement image annotée

3. **Historique** (`/history`)
   - Liste des détections passées
   - Sauvegarde locale (localStorage)
   - Modal de détail
   - Filtrage et tri

4. **Statistiques** (`/stats`)
   - Graphiques interactifs (Recharts)
   - Métriques de performance
   - Distribution des classes
   - Évolution temporelle

5. **À propos** (`/about`)
   - Description du projet
   - Technologies utilisées
   - Architecture système
   - Performances du modèle

### 🎨 Design

- **Framework UI**: Tailwind CSS
- **Animations**: Framer Motion
- **Icônes**: Lucide React
- **Graphiques**: Recharts
- **Responsive**: Mobile-first design
- **Dark mode**: Prêt (à activer si besoin)

## 🚀 Installation et Démarrage

### 1. Prérequis

```bash
# Node.js ≥ 18
node --version

# npm ou yarn
npm --version
```

### 2. Installation des Dépendances

```bash
cd web-app
npm install
```

### 3. Démarrer l'API Backend (dans un terminal séparé)

```bash
# Dans le dossier trash_full_detection/
source .venv/bin/activate
python api.py
```

L'API sera disponible sur `http://localhost:8000`

### 4. Démarrer le Frontend

```bash
# Dans le dossier web-app/
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📡 API Backend

### Endpoints Disponibles

#### 1. POST `/api/predict/image`
Détecte l'état d'une poubelle sur une image

**Request:**
```bash
curl -X POST "http://localhost:8000/api/predict/image" \
  -F "file=@image.jpg"
```

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "label": "poubelle_pleine",
      "confidence": 0.9135,
      "bbox": [3.14, 34.99, 474.77, 485.30]
    }
  ],
  "annotated_image": "base64_encoded_image...",
  "inference_time": 65.2,
  "image_shape": [640, 640],
  "model": "YOLOv8n"
}
```

#### 2. GET `/api/health`
Vérifie l'état de l'API

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "models/yolo/best.pt"
}
```

#### 3. GET `/api/stats`
Retourne les statistiques du modèle

**Response:**
```json
{
  "model": "YOLOv8n",
  "metrics": {
    "mAP50": 0.671,
    "precision": 0.652,
    "recall": 0.748
  },
  "classes": ["poubelle_pleine", "poubelle_vide"]
}
```

## 🛠️ Technologies

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS 3** - Framework CSS utility-first
- **Framer Motion** - Animations fluides
- **React Router 6** - Navigation SPA
- **Axios** - Client HTTP
- **React Dropzone** - Upload fichiers
- **Recharts** - Graphiques interactifs
- **Lucide React** - Icônes modernes

### Backend
- **FastAPI** - Framework Python async
- **Ultralytics** - YOLO inference
- **OpenCV** - Traitement d'images
- **NumPy** - Calculs numériques

## 📦 Build Production

### 1. Build Frontend

```bash
cd web-app
npm run build
```

Les fichiers compilés seront dans `web-app/dist/`

### 2. Servir en Production

**Option A: Serveur Node**
```bash
npm install -g serve
serve -s dist -p 3000
```

**Option B: Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/web-app/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

**Option C: Docker**

Créer `Dockerfile` dans `web-app/`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Configuration

### Modifier l'URL de l'API

Dans `web-app/vite.config.js`:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://votre-api.com:8000', // Changer ici
        changeOrigin: true,
      }
    }
  }
})
```

### Personnaliser les Couleurs

Dans `web-app/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#votre-couleur',
        // ...
      }
    }
  }
}
```

## 📊 Fonctionnalités Avancées

### Historique Local
Les détections sont sauvegardées dans `localStorage`:
```javascript
// Dernières 50 détections
localStorage.getItem('detectionHistory')
```

### Upload Multiple
Modifier `UploadPage.jsx`:
```javascript
const { getRootProps, getInputProps } = useDropzone({
  multiple: true,  // Activer multi-upload
  maxFiles: 10
})
```

### Temps Réel (Webcam)
Ajouter support webcam:
```javascript
// Utiliser react-webcam
import Webcam from "react-webcam"
```

## 🐛 Dépannage

### Erreur CORS
Vérifier que l'API FastAPI a les bons headers CORS:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erreur 503 (Modèle non chargé)
```bash
# Vérifier que best.pt existe
ls -lh models/yolo/best.pt

# Vérifier l'API
curl http://localhost:8000/api/health
```

### Performance Lente
```python
# Dans api.py, utiliser GPU si disponible
model.to('cuda')  # Au lieu de 'cpu'
```

## 📈 Améliorations Futures

- [ ] Support vidéo en temps réel
- [ ] Mode batch (plusieurs images)
- [ ] Export des résultats (CSV, PDF)
- [ ] Dashboard admin
- [ ] Authentification utilisateur
- [ ] Base de données (PostgreSQL)
- [ ] Notifications push
- [ ] Mode hors-ligne (PWA)
- [ ] Support multi-langues (i18n)
- [ ] Tests unitaires (Jest, Vitest)

## 📝 License

Projet académique - Master 2 SI/IA - 2025

## 🙏 Crédits

- **YOLOv8**: Ultralytics
- **Dataset**: Roboflow
- **Icons**: Lucide
- **UI**: Tailwind CSS

---

**Développé avec ❤️ pour la gestion intelligente des déchets**
