# 🚀 Guide de Déploiement - Trash Detection

## 📋 Prérequis

- Compte GitHub (gratuit)
- Compte Render.com (gratuit)
- Git installé localement

## 🔧 Étape 1 : Préparer le Projet

### 1.1 Initialiser Git (si pas déjà fait)

```bash
cd trash_full_detection
git init
git add .
git commit -m "Initial commit - Trash Detection App"
```

### 1.2 Construire le Frontend

```bash
# Exécuter le script de build
./build-frontend.sh

# Vérifier que le dossier static/ a été créé
ls -la static/
```

## 📦 Étape 2 : Créer un Dépôt GitHub

### 2.1 Via l'interface GitHub

1. Aller sur https://github.com/new
2. Nom du repository : `trash-detection-app`
3. Visibilité : **Public** (requis pour Render.com gratuit)
4. Ne pas initialiser avec README (on a déjà nos fichiers)
5. Cliquer "Create repository"

### 2.2 Pousser le Code

```bash
# Ajouter le remote GitHub (remplacer YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/trash-detection-app.git

# Pousser le code
git branch -M main
git push -u origin main
```

## 🌐 Étape 3 : Déployer sur Render.com

### 3.1 Créer un Compte Render

1. Aller sur https://render.com
2. S'inscrire avec GitHub (gratuit)
3. Autoriser Render à accéder à vos repos

### 3.2 Créer un Web Service

1. Dashboard → "New +"  → "Web Service"
2. Connecter votre repository GitHub `trash-detection-app`
3. Configuration :

```
Name: trash-detection
Region: Frankfurt (ou le plus proche)
Branch: main
Runtime: Docker
Instance Type: Free
```

### 3.3 Variables d'Environnement (optionnel)

Si besoin, ajouter dans "Environment Variables" :
```
PYTHON_VERSION=3.9.18
```

### 3.4 Déployer

1. Cliquer "Create Web Service"
2. Render va automatiquement :
   - Détecter le `Dockerfile`
   - Construire l'image Docker
   - Déployer l'application
   - Vous donner une URL : `https://trash-detection-xxxx.onrender.com`

⏱️ Le premier déploiement prend 5-10 minutes.

## ✅ Étape 4 : Vérifier le Déploiement

### 4.1 Tester l'API

```bash
# Health check
curl https://trash-detection-xxxx.onrender.com/api/health

# Info du modèle
curl https://trash-detection-xxxx.onrender.com/api/info
```

### 4.2 Tester l'Interface Web

1. Ouvrir `https://trash-detection-xxxx.onrender.com` dans un navigateur
2. Tester l'upload d'images
3. Tester l'upload de vidéos

## 🔧 Étape 5 : Configuration Avancée (Optionnel)

### 5.1 Domaine Personnalisé

1. Dans Render Dashboard → votre service → "Settings"
2. Section "Custom Domain"
3. Ajouter votre domaine

### 5.2 Optimisation des Performances

**Limitations du plan gratuit :**
- 512 MB RAM
- CPU partagé
- Service s'endort après 15 min d'inactivité
- Premier accès après sommeil : ~30 secondes

**Solutions :**
1. **Upgrade vers plan payant** ($7/mois) pour :
   - Toujours actif
   - Plus de RAM (1 GB+)
   - CPU dédié

2. **Garder le service actif** (gratuit mais limité) :
   - Créer un cron job qui ping l'API toutes les 10 minutes
   - Utiliser UptimeRobot (gratuit) : https://uptimerobot.com

## 🐛 Dépannage

### Erreur : "Failed to build"

**Cause :** Problème de dépendances

**Solution :**
1. Vérifier `requirements.txt`
2. Dans les logs Render, chercher l'erreur exacte
3. Ajuster les versions si nécessaire

### Erreur : "Model not found"

**Cause :** Fichier `models/yolo/best.pt` manquant

**Solution :**
1. Vérifier que le fichier est dans le repo
2. Vérifier `.gitignore` (ne doit pas exclure `*.pt`)
3. Re-commit et push

### Vidéos ne fonctionnent pas

**Cause :** Timeout (plan gratuit)

**Solutions :**
1. Limiter la durée des vidéos (< 30 secondes)
2. Upgrade vers plan payant
3. Utiliser un service séparé pour le traitement vidéo (AWS Lambda, etc.)

### Service très lent

**Cause :** Service endormi (plan gratuit)

**Solutions :**
1. Premier accès après sommeil = normal
2. Utiliser UptimeRobot pour garder actif
3. Upgrade vers plan payant

## 📊 Monitoring

### Logs en Temps Réel

```bash
# Via Render Dashboard
Dashboard → votre service → "Logs"
```

### Métriques

Le dashboard Render montre :
- CPU usage
- Memory usage
- Request count
- Response times

## 🔄 Mise à Jour

### Déploiement Automatique

Render redéploie automatiquement à chaque push sur `main` :

```bash
# Faire des modifications
git add .
git commit -m "Update: nouvelle fonctionnalité"
git push origin main

# Render redéploie automatiquement
```

### Déploiement Manuel

Si vous avez désactivé auto-deploy :

1. Render Dashboard → votre service
2. Cliquer "Manual Deploy" → "Deploy latest commit"

## 💰 Coûts

### Plan Gratuit (Actuel)
- ✅ **0 €/mois**
- ✅ 750 heures/mois
- ⚠️ Service s'endort après 15 min
- ⚠️ 512 MB RAM
- ⚠️ CPU partagé

### Plan Starter (Recommandé pour Production)
- 💵 **7 €/mois**
- ✅ Toujours actif
- ✅ 1 GB RAM
- ✅ CPU dédié
- ✅ SSL gratuit

## 🔐 Sécurité

### Recommandations Production

1. **CORS** : Limiter les origines dans `api.py`
```python
allow_origins=["https://votre-domaine.com"]
```

2. **Rate Limiting** : Ajouter slowapi
```bash
pip install slowapi
```

3. **Variables d'Environnement** : Pour les secrets
```python
API_KEY = os.environ.get("API_KEY")
```

## 📱 Alternatives de Déploiement Gratuit

### Option 1 : Vercel (Frontend) + Render (Backend)

**Avantages :**
- Frontend ultra-rapide sur Vercel
- Backend sur Render
- Les deux gratuits

**Setup :**
1. Frontend → Vercel (déploiement automatique depuis GitHub)
2. Backend → Render (comme ci-dessus)
3. Configurer l'URL API dans Vercel env vars

### Option 2 : Railway

**Avantages :**
- 500 heures gratuites/mois
- Plus de RAM (1 GB)
- Support Docker natif

**URL :** https://railway.app

### Option 3 : Fly.io

**Avantages :**
- 3 machines gratuites
- Plus de contrôle
- Meilleure performance

**URL :** https://fly.io

## 📞 Support

**Problèmes ?**
- Render Docs : https://render.com/docs
- Community Forum : https://community.render.com

**Pour ce projet :**
- Créer une issue sur GitHub
- Consulter `DEPLOIEMENT_APP.md` pour plus de détails

---

✅ **Votre application est maintenant déployée et accessible sur Internet !**

URL de test : Remplacer `xxxx` par votre ID Render
`https://trash-detection-xxxx.onrender.com`
