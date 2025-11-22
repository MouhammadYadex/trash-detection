FROM python:3.9-slim

WORKDIR /app

# Installer dépendances système pour OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY api.py .
COPY models/ models/

# Créer dossiers nécessaires
RUN mkdir -p temp_videos outputs/images outputs/video

# Exposer le port
EXPOSE 8000

# Lancer l'API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
