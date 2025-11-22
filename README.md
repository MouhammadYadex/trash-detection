# 🚮 Trash Full Detection

**Projet académique Master 2 SI / IA**  
**Détection et classification de poubelles pleines / vides avec YOLO uniquement**

---

## 📖 Résumé du projet

Ce projet utilise **exclusivement YOLO** (YOLOv8 ou YOLOv9) pour détecter si une poubelle est pleine ou non. Il couvre :

- **Détection d'objets** (bounding boxes) avec YOLO
- **Classification** (pleine / pas pleine) avec YOLO-Classification
- **Inférence sur images** et **vidéos**
- **Export de modèles** (.pt et .onnx)
- **Pipeline complet** d'entraînement, évaluation, visualisation et déploiement

> **Exigence du professeur** : utiliser uniquement YOLO pour toutes les tâches, sans recourir à d'autres architectures (ResNet, EfficientNet, CNN classiques, etc.).

---

## 📁 Structure du projet

```
trash_full_detection/
│
├── 1_yolo_detection_training.ipynb     # Notebook d'entraînement complet
├── 2_yolo_inference_app.ipynb          # Notebook d'inférence (image/vidéo)
├── models/
│   └── yolo/
│       ├── best.pt                      # Modèle entraîné PyTorch
│       ├── best.onnx                    # Modèle exporté ONNX
│       └── logs/                        # Logs d'entraînement
├── outputs/
│   ├── images/                          # Images annotées
│   ├── video/                           # Vidéos annotées
│   └── metrics/                         # Métriques et graphes
├── README.md                            # Ce fichier
└── requirements.txt                     # Dépendances Python
```

---

## 🚀 Comment exécuter le projet

### Prérequis

- Python 3.8+
- GPU recommandé (CUDA) pour entraînement
- Google Colab (gratuit) ou environnement local avec PyTorch

### Installation

```bash
pip install -r requirements.txt
```

### 1. Entraînement

Ouvrir `1_yolo_detection_training.ipynb` dans Google Colab ou Jupyter :

1. **Installer les dépendances** (première cellule)
2. **Télécharger le dataset Roboflow** (code fourni dans le notebook)
3. **Entraîner YOLO détection** (section 5)
4. **Entraîner YOLO classification** (section 6, optionnel)
5. **Visualiser métriques** (loss, mAP, confusion matrix)
6. **Exporter les modèles** (.pt et .onnx)

Les modèles entraînés seront sauvegardés dans `models/yolo/`.

### 2. Inférence

Ouvrir `2_yolo_inference_app.ipynb` :

1. **Charger les modèles** entraînés
2. **Uploader une image** et voir la détection annotée
3. **Uploader une vidéo** et générer une vidéo annotée avec overlay
4. **Télécharger** les résultats (images, vidéos, modèles)

### 3. Déploiement

Voir section 6 de `2_yolo_inference_app.ipynb` pour :

- **Application web** (FastAPI exemple fourni)
- **Mobile** (conversion TFLite)
- **Raspberry Pi** (installation et inférence temps réel)

---

## 📊 Métriques et résultats

Après entraînement, les métriques suivantes sont disponibles :

- **mAP50** et **mAP50-95** (mean Average Precision)
- **Precision** et **Recall**
- **F1-score**
- **Confusion matrix**
- **Courbes de loss** (box_loss, cls_loss)

Exemples de visualisations dans `outputs/metrics/`.

---

## 🎓 Notions académiques couvertes

- **IoU** (Intersection over Union)
- **mAP** (mean Average Precision)
- **Precision, Recall, F1-score**
- **Architecture YOLO** (Backbone, Neck, Head)
- **Comparaison détection vs classification**

Détails dans `1_yolo_detection_training.ipynb` (section 1).

---

## 📦 Export des modèles

Les modèles sont exportés en deux formats :

- **PyTorch** (`.pt`) : pour entraînement supplémentaire, fine-tuning
- **ONNX** (`.onnx`) : pour déploiement cross-platform (TensorRT, OpenVINO, ONNX Runtime)

Commande d'export (dans notebook 1, section 10) :

```python
model.export(format='onnx')
```

---

## 🖼️ Captures d'écran

*(À ajouter après exécution : images annotées, courbes de métriques, vidéo annotée)*

![Exemple détection](outputs/images/example_detection.jpg)
![Courbes de loss](outputs/metrics/loss_curve.png)

---

## 📚 Références

- **YOLOv9 Paper** : [https://arxiv.org/abs/2402.13616](https://arxiv.org/abs/2402.13616)
- **Ultralytics YOLO** : [https://docs.ultralytics.com/](https://docs.ultralytics.com/)
- **Roboflow** : [https://roboflow.com/](https://roboflow.com/)
- **Dataset** : `my-first-project-prs1r` (workspace: deep-nhhm8)

---

## 👤 Auteurs

Projet réalisé dans le cadre du Master 2 Systèmes Intelligents / Intelligence Artificielle.

---

## 📝 Licence

Ce projet est à usage académique uniquement.
