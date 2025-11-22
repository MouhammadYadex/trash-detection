# 📊 Résultats du Projet Trash Full Detection

## 🎯 Vue d'ensemble

Projet académique de détection automatique du niveau de remplissage des poubelles utilisant **YOLOv8n** (Ultralytics). Le modèle détecte deux classes : `poubelle_pleine` et `poubelle_vide`.

---

## 📈 Performances du Modèle

### Métriques Globales

| Métrique | Valeur | Description |
|----------|--------|-------------|
| **mAP50** | **67.1%** | Précision moyenne à IoU=0.50 (métrique principale) |
| **mAP50-95** | **41.1%** | Précision moyenne sur IoU de 0.50 à 0.95 |
| **Précision** | **65.2%** | Taux de vrais positifs parmi les détections |
| **Rappel** | **74.8%** | Taux de détection des poubelles présentes |

### Performances par Classe

| Classe | Précision | Rappel | mAP50 |
|--------|-----------|--------|-------|
| poubelle_pleine | ~70% | ~80% | ~70% |
| poubelle_vide | ~60% | ~70% | ~64% |

---

## 🗂️ Dataset

### Composition

- **Source** : Roboflow (workspace: deep-nhhm8, projet: my-first-project-prs1r, v2)
- **Total images** : 395
  - Train : 345 images (87.3%)
  - Validation : 25 images (6.3%)
  - Test : 25 images (6.3%)
- **Classes** : 2 (poubelle_pleine, poubelle_vide)
- **Format** : YOLOv9 (compatible YOLOv8)

### Annotations

- Format YOLO : `class_id x_center y_center width height` (coordonnées normalisées)
- Bounding boxes annotées manuellement
- Un seul objet principal par image

---

## 🏋️ Entraînement

### Configuration

```python
Architecture : YOLOv8n
Paramètres : 3,011,238
GFLOPs : 8.2
Époques : 30
Batch size : 16
Image size : 640x640
Device : CPU
Optimiseur : AdamW (lr0=0.01)
```

### Évolution des Pertes

| Époque | Box Loss | Class Loss | DFL Loss |
|--------|----------|------------|----------|
| 1 | 1.448 | 3.164 | 1.364 |
| 10 | 1.083 | 1.333 | 1.163 |
| 20 | 0.927 | 0.963 | 1.106 |
| 30 | 0.846 | 0.830 | 1.078 |

**Temps d'entraînement** : ~49 minutes (CPU Intel)

---

## 🧪 Tests d'Inférence

### Résultats sur Images de Test

#### Image 1 : `img_122_jpg.rf.7dd543872a8a7df198786227b6aeb614.jpg`
- **Classe détectée** : `poubelle_pleine`
- **Confiance** : 91.35%
- **Temps d'inférence** : 65.5ms
- **Bbox** : [3.14, 34.99, 474.78, 485.31]

#### Image 2 : `img_134_jpg.rf.3b456fc8c759d10eb71dd8d0480f1d3a.jpg`
- **Classe détectée** : `poubelle_pleine`
- **Confiance** : 41.49%
- **Temps d'inférence** : ~60ms

#### Image 3 : `img_15_jpg.rf.7b71311ce3b8b18890542419fdd21ca3.jpg`
- **Classe détectée** : `poubelle_pleine`
- **Confiance** : 93.77%
- **Temps d'inférence** : ~60ms

### Performance d'Inférence

- **Vitesse moyenne** : ~15 FPS (CPU)
- **Prétraitement** : 2.7ms
- **Inférence** : 65.5ms
- **Post-traitement** : 1.1ms

---

## 📦 Modèles Exportés

| Format | Fichier | Taille | Usage |
|--------|---------|--------|-------|
| PyTorch | `best.pt` | 5.96 MB | Entraînement, inférence Python |
| ONNX | `best.onnx` | 11.70 MB | Déploiement multiplateforme |

### Compatibilité

- ✅ Python (Ultralytics)
- ✅ ONNX Runtime
- ✅ TensorRT (après conversion)
- ✅ OpenVINO (après conversion)
- ✅ TFLite (via export supplémentaire)

---

## 🎯 Applications Pratiques

### 1. Optimisation des Tournées de Collecte

**Problème** : Les camions poubelles suivent des itinéraires fixes, collectant des poubelles vides.

**Solution** : 
- Caméras sur drones/véhicules détectent les poubelles pleines
- Génération d'itinéraires optimisés en temps réel
- **Économies** : 20-30% de réduction des kilomètres parcourus

### 2. Gestion Smart City

**Architecture** :
```
Caméras IoT → Edge Computing (Raspberry Pi) → API Cloud → Dashboard Web
```

**Bénéfices** :
- Surveillance 24/7 de l'état des poubelles
- Alertes automatiques pour collecte urgente
- Tableaux de bord temps réel pour les services municipaux

### 3. Analyse Prédictive

**Données collectées** :
- Fréquence de remplissage par localisation
- Pics d'utilisation (jours/heures)
- Saisonnalité

**Utilisation** :
- Prévision des besoins de collecte
- Dimensionnement optimal des équipements
- Planification des ressources humaines

---

## 🚀 Déploiement

### Option 1 : API REST (FastAPI)

```python
# api.py
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO

app = FastAPI()
model = YOLO("models/yolo/best.pt")

@app.post("/predict")
async def predict(file: UploadFile):
    results = model.predict(file, conf=0.25)
    return {"detections": parse_results(results)}
```

**Commande** : `uvicorn api:app --host 0.0.0.0 --port 8000`

### Option 2 : Edge Computing (Raspberry Pi)

**Matériel** :
- Raspberry Pi 4 (4GB RAM)
- Caméra USB/Pi Camera
- Optional : Coral USB Accelerator

**Installation** :
```bash
pip install ultralytics
yolo predict model=best.pt source=0  # Webcam
```

### Option 3 : Mobile (TFLite)

**Export** :
```python
model = YOLO('best.pt')
model.export(format='tflite')
```

**Intégration** : Android (Kotlin) / iOS (Swift)

---

## 📊 Visualisations Générées

### Fichiers disponibles dans `runs/detect/trash_yolo_model/`

1. **results.png** : Courbes de perte et métriques
2. **confusion_matrix.png** : Matrice de confusion
3. **BoxP_curve.png** : Courbe Précision-Confiance
4. **BoxR_curve.png** : Courbe Rappel-Confiance
5. **BoxPR_curve.png** : Courbe Précision-Rappel
6. **BoxF1_curve.png** : Courbe F1-Confiance

### Images annotées

- Disponibles dans `outputs/images/`
- Format : Bounding box + label + confiance
- Couleur : Bleu (détection YOLO par défaut)

---

## 🔍 Analyse des Résultats

### Points Forts

✅ **mAP50 de 67.1%** : Performance solide pour un dataset de 395 images  
✅ **Rappel de 74.8%** : Détecte la majorité des poubelles  
✅ **Inférence rapide** : ~65ms par image (adapté au temps réel)  
✅ **Modèle léger** : 6 MB, déployable sur edge devices  

### Points d'Amélioration

⚠️ **mAP50-95 de 41.1%** : Localisation des bounding boxes imprécise  
⚠️ **Confiance variable** : Certaines détections à 40-50%  
⚠️ **Dataset limité** : 395 images (idéal : 1000+)  
⚠️ **Conditions variées** : Peu d'images nocturnes, angles variés  

### Recommandations

1. **Augmentation des données** : Rotation, flip, luminosité, occlusions
2. **Dataset plus large** : 1000-2000 images, plus de variété (météo, éclairage)
3. **Segmentation** : YOLOv8-seg pour calcul du degré de remplissage précis
4. **Hyperparamètres** : Grid search sur learning rate, batch size
5. **Modèle plus lourd** : YOLOv8m ou YOLOv8l pour meilleures performances

---

## 🎓 Notions Académiques

### YOLO (You Only Look Once)

**Principe** : Détection d'objets en une seule passe (single-shot detector)

**Architecture YOLOv8** :
- **Backbone** : CSPDarknet (extraction features)
- **Neck** : PANet (fusion multi-échelle)
- **Head** : Découplé (classification + localisation)

**Loss Function** :
```
Loss_total = λ_box * Loss_box + λ_cls * Loss_cls + λ_dfl * Loss_dfl
```

- **Loss_box** : IoU/GIoU pour localisation
- **Loss_cls** : Binary cross-entropy pour classification
- **Loss_dfl** : Distribution Focal Loss pour raffinement bbox

### Métriques de Détection

**Precision** : `TP / (TP + FP)`  
→ Parmi les détections, combien sont correctes ?

**Recall** : `TP / (TP + FN)`  
→ Parmi les objets présents, combien sont détectés ?

**mAP** : Moyenne de la précision sur différents seuils de rappel  
→ Métrique globale de performance

**IoU** : `Intersection / Union` des bounding boxes  
→ Mesure la qualité de localisation

---

## 📝 Conclusion

Ce projet démontre la faisabilité d'un système de détection automatique du remplissage des poubelles avec YOLO. Les performances (mAP50 = 67.1%) sont satisfaisantes pour un prototype académique avec un dataset limité.

### Impact Potentiel

- 🌍 **Environnemental** : Réduction des émissions CO2 (-20-30%)
- 💰 **Économique** : Optimisation des coûts opérationnels
- 🏙️ **Sociétal** : Villes plus propres, services plus efficaces

### Perspectives

1. **Court terme** : Augmentation du dataset, fine-tuning
2. **Moyen terme** : Déploiement pilote sur 10-20 poubelles
3. **Long terme** : Intégration dans écosystème Smart City

---

## 📚 Références

- **Ultralytics YOLOv8** : https://docs.ultralytics.com/
- **Roboflow** : https://roboflow.com/
- **ONNX** : https://onnx.ai/
- **FastAPI** : https://fastapi.tiangolo.com/

---

**Projet réalisé dans le cadre d'un Master 2 en Systèmes Intelligents / Intelligence Artificielle**  
**Date** : Janvier 2025  
**Auteur** : [Votre nom]
