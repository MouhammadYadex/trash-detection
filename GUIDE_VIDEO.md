# 🎥 Guide de Détection Vidéo

## ✅ Fonctionnalité Ajoutée

Une **page dédiée** pour traiter les vidéos a été créée avec :
- Upload drag & drop de vidéos (MP4, AVI, MOV)
- Traitement frame par frame avec YOLO
- Vidéo annotée téléchargeable
- Statistiques complètes (FPS, durée, nombre de détections)
- Historique des vidéos traitées

---

## 🚀 Comment utiliser

### 1. **Accéder à la page Vidéo**

Dans l'application web (http://localhost:3000), cliquez sur **"Vidéos"** dans le menu de navigation.

### 2. **Uploader une vidéo**

**Option 1 - Drag & Drop:**
- Glissez-déposez votre vidéo dans la zone de dépôt

**Option 2 - Sélection:**
- Cliquez sur la zone de dépôt
- Sélectionnez votre fichier vidéo

**Formats acceptés:** MP4, AVI, MOV  
**Taille maximale:** 100 MB

### 3. **Lancer la détection**

1. Une fois la vidéo uploadée, une prévisualisation s'affiche
2. Cliquez sur **"Détecter sur Vidéo"**
3. **Attendez le traitement** (peut prendre quelques minutes selon la durée)
4. Une barre de progression s'affiche

### 4. **Voir les résultats**

Une fois le traitement terminé, vous obtenez :

#### 📹 **Vidéo Annotée**
- Chaque frame annotée avec les bounding boxes
- Compteur de frames
- Player vidéo intégré

#### 📊 **Statistiques**
- **Total frames**: Nombre de frames traitées
- **FPS**: Frames par seconde de la vidéo
- **Durée**: Durée totale en secondes
- **Temps de traitement**: Temps pris pour traiter la vidéo

#### 🎯 **Résumé des détections**
- Nombre total de détections
- Répartition par classe (poubelle_pleine / poubelle_vide)
- Nombre de frames où chaque classe apparaît

### 5. **Télécharger la vidéo annotée**

Cliquez sur **"Télécharger Vidéo Annotée"** pour enregistrer la vidéo avec les annotations.

---

## 🔧 Architecture Technique

### Backend (API)

**Endpoint:** `POST /api/predict/video`

**Traitement:**
1. Reçoit la vidéo uploadée
2. Ouvre avec OpenCV (`cv2.VideoCapture`)
3. Pour chaque frame :
   - Exécute YOLO inference
   - Annote le frame avec bounding boxes
   - Ajoute compteur de frames
   - Collecte les détections
4. Écrit vidéo annotée avec `cv2.VideoWriter`
5. Encode en base64
6. Retourne JSON avec vidéo + statistiques

**Code API (api.py):**
```python
@app.post("/api/predict/video")
async def predict_video(file: UploadFile = File(...)):
    # Traitement frame par frame
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Inférence YOLO sur frame
        results = model.predict(source=frame, conf=0.25, device='cpu')
        annotated_frame = results[0].plot()
        
        # Écrire frame annoté
        out.write(annotated_frame)
    
    # Retourner vidéo encodée + stats
    return {
        "video_base64": video_base64,
        "stats": {...},
        "detections": [...]
    }
```

### Frontend (React)

**Composant:** `VideoPage.jsx`

**Fonctionnalités:**
- React Dropzone pour upload
- Axios pour requête API (timeout 5 minutes)
- Barre de progression simulée
- Décodage base64 → Blob → URL pour lecture
- LocalStorage pour historique

**Flow:**
1. User drop vidéo → `onDrop()`
2. Prévisualisation avec `<video>`
3. Click "Détecter" → `handleDetect()`
4. POST `/api/predict/video` avec FormData
5. Affichage résultats + vidéo annotée
6. Download via blob URL

---

## ⚡ Optimisations Possibles

### 1. **Traitement par lots de frames**
Au lieu de traiter frame par frame, traiter par batch de 10-30 frames :
```python
batch_frames = []
for i in range(batch_size):
    ret, frame = cap.read()
    if ret:
        batch_frames.append(frame)

# Inférence sur batch
results = model.predict(source=batch_frames, batch=True)
```

### 2. **Réduire la résolution**
Redimensionner les frames avant inférence :
```python
frame_resized = cv2.resize(frame, (640, 480))
results = model.predict(source=frame_resized)
```

### 3. **Sauter des frames (frame skipping)**
Ne traiter que 1 frame sur N :
```python
skip_frames = 2  # Traiter 1 frame sur 3
if frame_count % skip_frames == 0:
    results = model.predict(source=frame)
```

### 4. **GPU Acceleration**
Si disponible, utiliser GPU :
```python
model.to('cuda')  # Au lieu de 'cpu'
results = model.predict(source=frame, device='cuda')
```

### 5. **Codec H.264 (plus efficace)**
Utiliser codec H.264 au lieu de mp4v :
```python
fourcc = cv2.VideoWriter_fourcc(*'H264')  # ou 'avc1', 'x264'
```

### 6. **WebSocket pour progression en temps réel**
Au lieu de simuler, envoyer vraie progression :
```python
# Backend
from fastapi import WebSocket

@app.websocket("/ws/video_progress")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Envoyer progression pendant traitement
    await websocket.send_json({"progress": frame_count / total_frames})
```

### 7. **Celery pour tâches asynchrones**
Pour vidéos longues, utiliser Celery :
```python
from celery import Celery

celery = Celery('tasks', broker='redis://localhost:6379')

@celery.task
def process_video(video_path):
    # Traitement long
    pass

# API retourne task_id
# Frontend poll status avec GET /task/{task_id}
```

---

## 📊 Performances Attendues

### Exemple avec vidéo 30s @ 30 FPS

**Spécifications:**
- Durée: 30 secondes
- FPS: 30
- Total frames: 900
- Résolution: 1920x1080

**Sans optimisation (CPU):**
- Temps par frame: ~50-100ms
- Temps total: 45-90 secondes
- Ratio: 1.5-3x temps réel

**Avec GPU (CUDA):**
- Temps par frame: ~10-20ms
- Temps total: 9-18 secondes
- Ratio: 0.3-0.6x temps réel

**Avec optimisations (skip 2 frames, résolution 640x480):**
- Frames traitées: 300
- Temps par frame: ~30ms
- Temps total: 9 secondes
- Ratio: 0.3x temps réel

---

## 🐛 Dépannage

### Erreur: "connect ECONNREFUSED 127.0.0.1:8000"

**Cause:** API backend non démarrée

**Solution:**
```bash
cd /home/mouhammad/Bureau/nourrou/projet-poubelle/trash_full_detection
source .venv/bin/activate
python api.py
```

### Erreur: "Request Timeout"

**Cause:** Vidéo trop longue, timeout atteint (5 min)

**Solutions:**
1. Augmenter timeout dans `VideoPage.jsx` :
```jsx
timeout: 600000 // 10 minutes
```

2. Réduire durée/résolution vidéo

3. Utiliser frame skipping

### Erreur: "File too large"

**Cause:** Vidéo > 100 MB

**Solutions:**
1. Augmenter limite dans `VideoPage.jsx` :
```jsx
maxSize: 200 * 1024 * 1024 // 200 MB
```

2. Compresser vidéo avec ffmpeg :
```bash
ffmpeg -i input.mp4 -vcodec h264 -crf 28 output.mp4
```

### Vidéo annotée ne se télécharge pas

**Cause:** Erreur décodage base64

**Solution:** Vérifier que le backend retourne bien `video_base64`

**Test API direct:**
```bash
curl -X POST "http://localhost:8000/api/predict/video" \
  -F "file=@test.mp4" \
  -o result.json

# Extraire vidéo
jq -r '.video_base64' result.json | base64 -d > output.mp4
```

### Vidéo noire/corrompue

**Cause:** Codec incompatible

**Solutions:**
1. Changer codec dans API :
```python
fourcc = cv2.VideoWriter_fourcc(*'XVID')  # Tester différents codecs
```

2. Convertir vidéo source :
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset fast output.mp4
```

---

## 📝 Exemple d'utilisation avec le notebook

Si vous voulez tester en dehors de l'app web, utilisez le notebook **2_yolo_inference_app.ipynb** :

```python
# Cellule : Traitement vidéo
video_path = "chemin/vers/votre/video.mp4"
output_path = "outputs/video/annotated_video.mp4"

cap = cv2.VideoCapture(video_path)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, 30, (width, height))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    results = model_detect.predict(source=frame, conf=0.25, device='cpu')
    annotated = results[0].plot()
    out.write(annotated)

cap.release()
out.release()
print(f"Vidéo sauvegardée: {output_path}")
```

---

## 🎯 Résumé

**Vous pouvez maintenant :**
✅ Uploader des vidéos (MP4, AVI, MOV)  
✅ Traiter frame par frame avec YOLO  
✅ Voir vidéo annotée avec détections  
✅ Télécharger la vidéo annotée  
✅ Consulter statistiques détaillées  
✅ Historique des vidéos traitées  

**Endpoints API disponibles :**
- `POST /api/predict/image` → Images
- `POST /api/predict/video` → Vidéos ✨ NOUVEAU
- `GET /api/health` → Status
- `GET /api/stats` → Métriques modèle

**Navigation app :**
- `/` → Accueil
- `/upload` → Images
- `/video` → Vidéos ✨ NOUVEAU
- `/history` → Historique
- `/stats` → Statistiques
- `/about` → À propos

---

**Votre application est maintenant complète avec support Images ET Vidéos ! 🎥🎉**
