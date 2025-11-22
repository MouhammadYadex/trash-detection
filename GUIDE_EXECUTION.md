# 🚀 Guide d'Exécution Rapide - Trash Full Detection

Ce guide vous permet d'exécuter le projet complet de A à Z.

---

## ⚡ Démarrage Rapide (5 minutes)

### 1. Prérequis
```bash
# Vérifier Python (≥3.8 requis)
python3 --version

# Vérifier pip
pip3 --version
```

### 2. Installation Environnement
```bash
# Aller dans le dossier projet
cd trash_full_detection/

# Activer l'environnement virtuel
source .venv/bin/activate

# Vérifier installation
pip list | grep ultralytics  # Devrait afficher ultralytics 8.3.230
```

### 3. Test Inférence Rapide (Modèle Déjà Entraîné)
```bash
# Tester l'inférence sur une image de test
python3 << EOF
from ultralytics import YOLO
model = YOLO('models/yolo/best.pt')
results = model.predict('My-First-Project-2/test/images/img_122_jpg.rf.7dd543872a8a7df198786227b6aeb614.jpg', device='cpu')
print('Détections:', len(results[0].boxes))
for box in results[0].boxes:
    print(f"  - {results[0].names[int(box.cls[0])]}: {float(box.conf[0]):.2%}")
EOF
```

**Résultat attendu** : 
```
Détections: 1
  - poubelle_pleine: 91.35%
```

---

## 📓 Exécution des Notebooks

### Option A : VS Code (Recommandé)
```bash
# Ouvrir VS Code dans le dossier
code .

# Ouvrir les notebooks :
# - 1_yolo_detection_training.ipynb
# - 2_yolo_inference_app.ipynb

# Sélectionner kernel : .venv/bin/python
# Exécuter les cellules une par une (Shift+Enter)
```

### Option B : Jupyter Notebook
```bash
# Installer Jupyter si nécessaire
pip install jupyter

# Lancer Jupyter
jupyter notebook

# Naviguer vers :
# - 1_yolo_detection_training.ipynb (pour entraînement)
# - 2_yolo_inference_app.ipynb (pour inférence)
```

### Option C : JupyterLab
```bash
pip install jupyterlab
jupyter lab
```

---

## 🏋️ Entraîner un Nouveau Modèle

### Notebook 1 : Training

**Cellules à exécuter dans l'ordre :**

1. **Cellule 4** : Installation dépendances
   ```python
   !pip install -q ultralytics roboflow opencv-python-headless matplotlib seaborn
   ```

2. **Cellule 5** : Imports
   ```python
   from ultralytics import YOLO
   import cv2, os, matplotlib.pyplot as plt, seaborn as sns
   ```

3. **Cellule 7** : Téléchargement dataset Roboflow
   ```python
   from roboflow import Roboflow
   rf = Roboflow(api_key="4zGCDGgIjB5Lg8TVVqSY")
   project = rf.workspace("deep-nhhm8").project("my-first-project-prs1r")
   version = project.version(2)
   dataset = version.download("yolov9")
   ```
   ⏱️ **Temps** : ~30 secondes

4. **Cellule 8** : Visualisation dataset (optionnel)

5. **Cellule 12** : Entraînement YOLO
   ```python
   model = YOLO('yolov8n.pt')
   results = model.train(
       data='My-First-Project-2/data.yaml',
       epochs=30,
       batch=16,
       imgsz=640,
       device='cpu',
       project='runs/detect',
       name='trash_yolo_model'
   )
   ```
   ⏱️ **Temps** : ~49 minutes (CPU) / ~10 minutes (GPU)

6. **Cellule 16** : Visualisation métriques

7. **Cellule 19** : Évaluation
   ```python
   eval_model = YOLO('runs/detect/trash_yolo_model/weights/best.pt')
   results = eval_model.val(data='My-First-Project-2/data.yaml')
   ```

8. **Cellule 21** : Export ONNX
   ```python
   model.export(format='onnx')
   ```

---

## 🔍 Tester l'Inférence

### Notebook 2 : Inference

**Cellules à exécuter :**

1. **Cellule 4** : Installation (si besoin)
2. **Cellule 5** : Imports
3. **Cellule 6** : Chargement modèle
   ```python
   model_detect = YOLO('models/yolo/best.pt')
   model_detect.to('cpu')  # Important pour éviter erreur CUDA
   ```

4. **Cellule 8** : Sélection image test
5. **Cellule 9** : Inférence image
   ```python
   results = model_detect.predict(source=img_path, save=False, conf=0.25, device='cpu')
   ```
   ⏱️ **Temps** : ~65ms par image

6. **Cellule 11** : Tests multiples images

---

## 🎯 Commandes CLI (Sans Notebooks)

### Entraînement via CLI
```bash
yolo detect train \
  data=My-First-Project-2/data.yaml \
  model=yolov8n.pt \
  epochs=30 \
  batch=16 \
  imgsz=640 \
  device=cpu \
  project=runs/detect \
  name=trash_yolo_cli
```

### Inférence via CLI
```bash
# Image unique
yolo detect predict \
  model=models/yolo/best.pt \
  source=My-First-Project-2/test/images/img_122_jpg.rf.7dd543872a8a7df198786227b6aeb614.jpg \
  conf=0.25 \
  device=cpu

# Dossier d'images
yolo detect predict \
  model=models/yolo/best.pt \
  source=My-First-Project-2/test/images/ \
  conf=0.25 \
  device=cpu \
  save=True
```

### Évaluation via CLI
```bash
yolo detect val \
  model=models/yolo/best.pt \
  data=My-First-Project-2/data.yaml \
  device=cpu
```

---

## 🐛 Dépannage

### Problème 1 : Erreur CUDA
**Symptôme** : `AcceleratorError: CUDA error: no kernel image is available`

**Solution** :
```python
# Forcer CPU dans tous les appels
model = YOLO('models/yolo/best.pt')
model.to('cpu')
results = model.predict(source=..., device='cpu')
```

### Problème 2 : Module Not Found
**Symptôme** : `ModuleNotFoundError: No module named 'ultralytics'`

**Solution** :
```bash
# Vérifier environnement actif
which python  # Doit pointer vers .venv/bin/python

# Réinstaller si besoin
pip install ultralytics
```

### Problème 3 : Dataset Introuvable
**Symptôme** : `FileNotFoundError: data.yaml not found`

**Solution** :
```python
# Re-télécharger dataset
from roboflow import Roboflow
rf = Roboflow(api_key="4zGCDGgIjB5Lg8TVVqSY")
project = rf.workspace("deep-nhhm8").project("my-first-project-prs1r")
dataset = project.version(2).download("yolov9")
```

---

## 📊 Vérification Résultats

### Après Entraînement
```bash
# Vérifier weights
ls -lh runs/detect/trash_yolo_model/weights/
# Devrait afficher : best.pt, last.pt

# Voir métriques
cat runs/detect/trash_yolo_model/results.csv | tail -1

# Visualiser courbes
open runs/detect/trash_yolo_model/results.png  # macOS
xdg-open runs/detect/trash_yolo_model/results.png  # Linux
```

### Après Inférence
```bash
# Images annotées
ls outputs/images/

# Modèles exportés
ls -lh models/yolo/
```

---

## 🚀 Déploiement Production

### API FastAPI
```bash
# Créer api.py
cat > api.py << 'EOF'
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import shutil

app = FastAPI()
model = YOLO("models/yolo/best.pt")
model.to('cpu')

@app.post("/predict")
async def predict(file: UploadFile):
    path = f"/tmp/{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    results = model.predict(path, device='cpu')
    detections = []
    for box in results[0].boxes:
        detections.append({
            "label": results[0].names[int(box.cls[0])],
            "confidence": float(box.conf[0]),
            "bbox": box.xyxy[0].tolist()
        })
    return {"detections": detections}
EOF

# Lancer API
pip install fastapi uvicorn python-multipart
uvicorn api:app --host 0.0.0.0 --port 8000
```

**Tester** :
```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@My-First-Project-2/test/images/img_122_jpg.rf.7dd543872a8a7df198786227b6aeb614.jpg"
```

---

## ⏱️ Temps d'Exécution Typiques

| Tâche | CPU | GPU (CUDA) |
|-------|-----|------------|
| Téléchargement dataset | 30s | 30s |
| Entraînement (30 époques) | 49min | 10min |
| Évaluation | 2min | 30s |
| Export ONNX | 10s | 5s |
| Inférence (1 image) | 65ms | 10ms |
| Inférence (vidéo 30fps, 1min) | 3min | 30s |

---

## 📚 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `models/yolo/best.pt` | Modèle entraîné (PyTorch) |
| `models/yolo/best.onnx` | Modèle exporté (ONNX) |
| `My-First-Project-2/data.yaml` | Configuration dataset |
| `runs/detect/trash_yolo_model/` | Résultats entraînement |
| `outputs/images/` | Images annotées |

---

## ✅ Checklist Avant Livraison

- [ ] Environnement virtuel activé
- [ ] Dataset téléchargé (395 images)
- [ ] Modèle entraîné (mAP50 ≥ 60%)
- [ ] Modèles exportés (.pt et .onnx)
- [ ] Tests inférence réussis (≥90% confiance)
- [ ] Notebooks exécutés sans erreur
- [ ] Documentation lue (README.md, RESULTATS.md)

---

## 🎓 Pour Aller Plus Loin

### Améliorer les Performances
```python
# 1. Augmentation dataset
model.train(data='...', epochs=50, augment=True)

# 2. Modèle plus lourd
model = YOLO('yolov8m.pt')  # ou yolov8l.pt

# 3. Hyperparameter tuning
model.train(..., lr0=0.001, momentum=0.9, weight_decay=0.0005)
```

### Déploiement Avancé
- **Docker** : Containeriser l'API
- **Kubernetes** : Scalabilité cloud
- **Edge** : Raspberry Pi + Coral TPU
- **Mobile** : TFLite + Flutter/React Native

---

## 📞 Support

En cas de problème :
1. Vérifier `STATUS.md` (section Dépannage)
2. Consulter logs : `runs/detect/trash_yolo_model/`
3. Documentation Ultralytics : https://docs.ultralytics.com/

---

**Projet Trash Full Detection - Janvier 2025**  
**Master 2 SI/IA**
