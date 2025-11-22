# 🎯 Déploiement sur Render.com - Résumé Rapide# Déploiement de l'Application Trash Detection



## ✅ Fichiers de Déploiement Créés## 🚀 Guide Rapide de Démarrage



| Fichier | Description | Statut |### 1. Backend (API FastAPI)

|---------|-------------|--------|

| `Dockerfile` | Configuration Docker avec Python 3.9 + OpenCV | ✅ |```bash

| `Procfile` | Commande de démarrage pour Render | ✅ |# Terminal 1 - API Backend

| `runtime.txt` | Version Python (3.9.18) | ✅ |cd /home/mouhammad/Bureau/nourrou/projet-poubelle/trash_full_detection

| `render.yaml` | Configuration auto-deploy Render | ✅ |source .venv/bin/activate

| `build-frontend.sh` | Script de build React → static/ | ✅ |python api.py

| `api.py` | Backend FastAPI restauré et fonctionnel | ✅ |```



## 🚀 Déploiement en 5 Minutes**L'API sera disponible sur:** `http://localhost:8000`

**Documentation API:** `http://localhost:8000/docs`

### 1️⃣ Build du Frontend

```bash### 2. Frontend (React)

cd /home/mouhammad/Bureau/nourrou/projet-poubelle/trash_full_detection

./build-frontend.sh```bash

```# Terminal 2 - Frontend React

cd /home/mouhammad/Bureau/nourrou/projet-poubelle/trash_full_detection/web-app

### 2️⃣ Créer un Repo GitHubnpm install  # Première fois seulement

```bashnpm run dev

git init```

git add .

git commit -m "Initial commit - Trash Detection App"**L'application sera disponible sur:** `http://localhost:3000`

git remote add origin https://github.com/YOUR_USERNAME/trash-detection.git

git push -u origin main---

```

## 📦 Installation Complète

### 3️⃣ Déployer sur Render

### Étape 1: Vérifier Node.js

1. Aller sur https://render.com et se connecter avec GitHub

2. Cliquer "New +" → "Web Service"```bash

3. Sélectionner votre repo `trash-detection`node --version  # Doit être ≥ 18

4. Configuration automatique :npm --version

   - **Runtime:** Docker (détecté automatiquement)```

   - **Instance Type:** Free

   - **Region:** FrankfurtSi Node.js n'est pas installé:

5. Cliquer "Create Web Service"```bash

6. Attendre 5-10 minutes ⏱️# Ubuntu/Debian

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

### 4️⃣ Tester l'Applicationsudo apt-get install -y nodejs



Votre app sera disponible sur : `https://trash-detection-xxxx.onrender.com`# Vérifier

node --version

**Endpoints :**```

- `/` → Interface React

- `/api/health` → Santé de l'API### Étape 2: Installer les Dépendances Frontend

- `/api/predict/image` → Upload image

- `/api/predict/video` → Upload vidéo```bash

- `/api/info` → Info modèlecd web-app/

npm install

## 📦 Structure du Déploiement```



```Cela installera:

trash_full_detection/- React 18

├── api.py                 # Backend FastAPI (restauré)- Vite

├── Dockerfile            # Build Docker avec OpenCV- Tailwind CSS

├── Procfile              # web: uvicorn api:app --host 0.0.0.0 --port $PORT- Framer Motion

├── runtime.txt           # python-3.9.18- Axios

├── render.yaml           # Auto-deploy config- React Router

├── build-frontend.sh     # npm install → vite build → copy to static/- Recharts

├── requirements.txt      # Dépendances Python- Et toutes les autres dépendances

├── models/

│   └── yolo/### Étape 3: Vérifier le Modèle

│       └── best.pt       # Modèle YOLOv8n (6 MB)

└── static/               # Frontend React buildé (créé par build-frontend.sh)```bash

    ├── index.html# Vérifier que le modèle existe

    ├── assets/ls -lh models/yolo/best.pt

    │   ├── index-xxx.js

    │   └── index-xxx.css# Devrait afficher: -rw-rw-r-- ... 6.0M ... models/yolo/best.pt

    └── ...```

```

### Étape 4: Tester l'API

## 🔧 Variables d'Environnement (Optionnel)

```bash

Si besoin, ajouter dans Render Dashboard → Settings → Environment :# Terminal 1

python api.py

```env

PORT=8000                    # Défini automatiquement par Render# Terminal 2 (nouveau)

PYTHON_VERSION=3.9.18        # Optionnel (défini dans runtime.txt)curl http://localhost:8000/api/health

```

# Devrait retourner: {"status":"healthy","model_loaded":true}

## 🐛 Résolution de Problèmes```



### Erreur : "Model not found"### Étape 5: Démarrer le Frontend

**Solution :** Vérifier que `models/yolo/best.pt` est dans le repo et pas ignoré par `.gitignore`

```bash

```bashcd web-app/

# Vérifiernpm run dev

ls -lh models/yolo/best.pt```



# Si manquant, l'ajouterOuvrez votre navigateur: `http://localhost:3000`

git add models/yolo/best.pt

git commit -m "Add YOLO model"---

git push

```## 🧪 Tester l'Application



### Erreur : "Build failed"### Test 1: Page d'Accueil

**Solution :** Vérifier les logs Render pour l'erreur exacte- Accédez à `http://localhost:3000`

- Vérifiez que les statistiques s'affichent

1. Render Dashboard → votre service → "Logs"- Cliquez sur "Commencer la Détection"

2. Chercher la ligne d'erreur

3. Généralement : dépendance manquante dans `requirements.txt`### Test 2: Upload d'Image

1. Allez sur `/upload`

### Vidéos trop lentes2. Glissez-déposez une image de test:

**Cause :** Plan gratuit (512 MB RAM, CPU partagé)   ```

   My-First-Project-2/test/images/img_122_jpg.rf.7dd543872a8a7df198786227b6aeb614.jpg

**Solutions :**   ```

- Limiter les vidéos à < 30 secondes3. Cliquez sur "Détecter"

- Upgrade vers Starter ($7/mois) pour 1 GB RAM4. Vérifiez que la détection apparaît avec:

- Utiliser un service séparé pour le traitement vidéo   - Image annotée

   - Label (poubelle_pleine/vide)

### Service s'endort   - Confiance (%)

**Cause :** Plan gratuit s'endort après 15 min d'inactivité   - JSON des coordonnées



**Solutions :**### Test 3: Historique

- Utiliser UptimeRobot (gratuit) pour garder actif1. Après quelques détections

- Upgrade vers Starter pour service toujours actif2. Allez sur `/history`

3. Vérifiez que les détections sont sauvegardées

## 💡 Alternatives Gratuites4. Cliquez sur une détection pour voir les détails



### Option 1 : Vercel (Frontend) + Render (Backend)### Test 4: Statistiques

- Frontend sur Vercel (ultra-rapide)1. Allez sur `/stats`

- Backend sur Render2. Vérifiez les graphiques interactifs

- Les deux gratuits3. Testez le hover sur les charts



### Option 2 : Railway.app---

- 500 heures/mois gratuites

- 1 GB RAM## 🐛 Résolution de Problèmes

- Meilleure performance

### Problème 1: "Cannot find module 'react'"

### Option 3 : Fly.io

- 3 machines gratuites**Solution:**

- Plus de contrôle```bash

- Régions multiplescd web-app/

rm -rf node_modules package-lock.json

## 📊 Limites du Plan Gratuitnpm install

```

| Ressource | Gratuit | Starter ($7/mois) |

|-----------|---------|-------------------|### Problème 2: "Port 3000 already in use"

| RAM | 512 MB | 1 GB+ |

| CPU | Partagé | Dédié |**Solution:**

| Uptime | Sommeil après 15 min | Toujours actif |```bash

| Build Time | 15 min | 15 min |# Trouver le processus

| Bandwidth | 100 GB/mois | Illimité |lsof -ti:3000



## ✅ Checklist Avant Déploiement# Tuer le processus

kill -9 $(lsof -ti:3000)

- [ ] `api.py` restauré et fonctionnel

- [ ] `./build-frontend.sh` exécuté avec succès# Ou changer le port dans vite.config.js

- [ ] Dossier `static/` créé avec les fichiers React```

- [ ] `models/yolo/best.pt` présent (6 MB)

- [ ] Repo GitHub créé et code pushé### Problème 3: API retourne 503 (Model not loaded)

- [ ] Compte Render.com créé

- [ ] Service Render créé et déployé**Solution:**

- [ ] URL testée : `https://trash-detection-xxxx.onrender.com````bash

# Vérifier le chemin du modèle

## 📚 Documentation Complètels models/yolo/best.pt



Pour un guide détaillé étape par étape : **`DEPLOIEMENT_GUIDE.md`**# Vérifier les logs de l'API

python api.py

## 🎉 Après le Déploiement# Devrait afficher: "✅ Modèle chargé: models/yolo/best.pt"

```

**Votre application est maintenant en ligne !**

### Problème 4: CORS Error

Partagez l'URL :

```**Vérifier dans api.py:**

https://trash-detection-xxxx.onrender.com```python

```app.add_middleware(

    CORSMiddleware,

**Features :**    allow_origins=["*"],  # Autoriser tous les origins

- ✅ Upload et détection d'images    allow_credentials=True,

- ✅ Upload et traitement de vidéos    allow_methods=["*"],

- ✅ Interface React moderne    allow_headers=["*"],

- ✅ API REST avec FastAPI)

- ✅ Modèle YOLOv8n optimisé CPU```

- ✅ SSL/HTTPS automatique

### Problème 5: Images ne s'affichent pas

---

**Vérifier:**

**Besoin d'aide ?** Consultez `DEPLOIEMENT_GUIDE.md` ou les docs Render : https://render.com/docs1. L'API retourne bien `annotated_image` en base64

2. Dans la console du navigateur (F12), vérifier les erreurs
3. Tester l'API directement:
   ```bash
   curl -X POST "http://localhost:8000/api/predict/image" \
     -F "file=@My-First-Project-2/test/images/img_122_jpg.rf.7dd543872a8a7df198786227b6aeb614.jpg"
   ```

---

## 🚀 Déploiement Production

### Option 1: VPS/Cloud (Recommandé)

#### A. Build Frontend

```bash
cd web-app/
npm run build
# Crée le dossier dist/
```

#### B. Servir avec Nginx

```bash
# Installer Nginx
sudo apt install nginx

# Copier les fichiers build
sudo cp -r dist/* /var/www/html/

# Configuration Nginx
sudo nano /etc/nginx/sites-available/trash-detection
```

Contenu:
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/trash-detection /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### C. API en Background avec Systemd

```bash
sudo nano /etc/systemd/system/trash-api.service
```

Contenu:
```ini
[Unit]
Description=Trash Detection API
After=network.target

[Service]
Type=simple
User=votre-user
WorkingDirectory=/path/to/trash_full_detection
Environment="PATH=/path/to/trash_full_detection/.venv/bin"
ExecStart=/path/to/trash_full_detection/.venv/bin/python api.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start trash-api
sudo systemctl enable trash-api
sudo systemctl status trash-api
```

### Option 2: Docker

#### Dockerfile Backend

Créer `Dockerfile` dans `trash_full_detection/`:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Exposer le port
EXPOSE 8000

# Lancer l'API
CMD ["python", "api.py"]
```

#### Dockerfile Frontend

Déjà créé ci-dessus dans le README web-app.

#### Docker Compose

Créer `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models
    environment:
      - MODEL_PATH=models/yolo/best.pt
  
  frontend:
    build: ./web-app
    ports:
      - "80:80"
    depends_on:
      - backend
```

```bash
# Lancer
docker-compose up -d

# Vérifier
docker-compose ps
```

---

## 📊 Monitoring et Logs

### Backend Logs

```bash
# Voir les logs en temps réel
tail -f /var/log/trash-api.log

# Ou avec systemd
sudo journalctl -u trash-api -f
```

### Frontend Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔒 Sécurité

### 1. HTTPS avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### 2. Rate Limiting (API)

Dans `api.py`:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/predict/image")
@limiter.limit("10/minute")  # Max 10 requêtes/minute
async def predict_image(...):
    ...
```

---

## 📈 Performance

### Frontend

```bash
# Analyser le bundle
cd web-app/
npm run build
npx vite-bundle-visualizer
```

### Backend

```bash
# Utiliser Gunicorn pour production
pip install gunicorn
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## ✅ Checklist de Déploiement

- [ ] Node.js installé (≥18)
- [ ] Dépendances npm installées
- [ ] Modèle YOLO présent (best.pt)
- [ ] API démarrée et accessible
- [ ] Frontend build et servi
- [ ] Tests fonctionnels OK
- [ ] HTTPS configuré (production)
- [ ] Monitoring activé
- [ ] Backups configurés
- [ ] Documentation à jour

---

**Application prête pour la production !** 🎉
