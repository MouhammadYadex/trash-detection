from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
import cv2
import numpy as np
import base64
import os
from pathlib import Path
import shutil

app = FastAPI(title="Trash Detection API", version="1.0.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

MODEL_PATH = "models/yolo/best.pt"
model = None

@app.on_event("startup")
async def load_model():
	global model
	try:
		if os.path.exists(MODEL_PATH):
			model = YOLO(MODEL_PATH)
			model.to('cpu')
			print(f"✅ Modèle chargé: {MODEL_PATH}")
		else:
			raise FileNotFoundError(f"Modèle non trouvé: {MODEL_PATH}")
	except Exception as e:
		print(f"❌ Erreur: {str(e)}")
		raise e

static_dir = Path(__file__).parent / "static"
if static_dir.exists():
	app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")

@app.get("/api/health")
async def health_check():
	return {
		"status": "healthy",
		"model_loaded": model is not None
	}

@app.post("/api/predict/image")
async def predict_image(file: UploadFile = File(...)):
	if model is None:
		raise HTTPException(status_code=500, detail="Modèle non chargé")
    
	try:
		if not file.content_type.startswith("image/"):
			raise HTTPException(status_code=400, detail="Fichier doit être une image")
        
		contents = await file.read()
		nparr = np.frombuffer(contents, np.uint8)
		image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
		if image is None:
			raise HTTPException(status_code=400, detail="Impossible de lire l'image")
        
		results = model(image, conf=0.25)
		annotated_image = results[0].plot()
		_, buffer = cv2.imencode('.jpg', annotated_image)
		img_base64 = base64.b64encode(buffer).decode('utf-8')
        
		boxes = results[0].boxes
		detections = []
		for box in boxes:
			detection = {
				"confidence": float(box.conf[0]),
				"class_id": int(box.cls[0]),
				"class_name": results[0].names[int(box.cls[0])],
				"bbox": box.xyxy[0].tolist()
			}
			detections.append(detection)
        
		return JSONResponse({
			"success": True,
			"image": f"data:image/jpeg;base64,{img_base64}",
			"detections_count": len(detections),
			"detections": detections
		})
	except HTTPException:
		raise
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/video")
async def predict_video(file: UploadFile = File(...)):
	if model is None:
		raise HTTPException(status_code=500, detail="Modèle non chargé")
    
	try:
		if not file.content_type.startswith("video/"):
			raise HTTPException(status_code=400, detail="Fichier doit être une vidéo")
        
		temp_dir = Path("temp_videos")
		temp_dir.mkdir(exist_ok=True)
        
		input_path = temp_dir / file.filename
		with open(input_path, "wb") as buffer:
			shutil.copyfileobj(file.file, buffer)
        
		cap = cv2.VideoCapture(str(input_path))
		if not cap.isOpened():
			raise HTTPException(status_code=400, detail="Impossible de lire la vidéo")
        
		fps = int(cap.get(cv2.CAP_PROP_FPS))
		width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
		height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
		total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
		output_path = temp_dir / f"output_{file.filename}"
		fourcc = cv2.VideoWriter_fourcc(*'mp4v')
		out = cv2.VideoWriter(str(output_path), fourcc, fps, (width, height))
        
		frame_count = 0
		total_detections = 0
		detection_stats = {}
        
		while True:
			ret, frame = cap.read()
			if not ret:
				break
            
			results = model(frame, conf=0.25, verbose=False)
			annotated_frame = results[0].plot()
			out.write(annotated_frame)
            
			boxes = results[0].boxes
			frame_detections = len(boxes)
			total_detections += frame_detections
            
			for box in boxes:
				class_name = results[0].names[int(box.cls[0])]
				detection_stats[class_name] = detection_stats.get(class_name, 0) + 1
            
			frame_count += 1
        
		cap.release()
		out.release()
        
		with open(output_path, "rb") as video_file:
			video_bytes = video_file.read()
			video_base64 = base64.b64encode(video_bytes).decode('utf-8')
        
		input_path.unlink()
		output_path.unlink()
        
		return JSONResponse({
			"success": True,
			"video": f"data:video/mp4;base64,{video_base64}",
			"frames_processed": frame_count,
			"total_detections": total_detections,
			"average_detections_per_frame": round(total_detections / frame_count, 2) if frame_count > 0 else 0,
			"detection_stats": detection_stats,
			"video_info": {
				"fps": fps,
				"width": width,
				"height": height,
				"total_frames": total_frames
			}
		})
	except HTTPException:
		raise
	except Exception as e:
		if 'input_path' in locals() and input_path.exists():
			input_path.unlink()
		if 'output_path' in locals() and output_path.exists():
			output_path.unlink()
		raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/info")
async def get_info():
	if model is None:
		return {"error": "Modèle non chargé"}
    
	return {
		"model_type": "YOLOv8n",
		"classes": model.names,
		"num_classes": len(model.names),
		"endpoints": ["/api/predict/image", "/api/predict/video", "/api/health", "/api/info"]
	}

if __name__ == "__main__":
	import uvicorn
	port = int(os.environ.get("PORT", 8000))
	uvicorn.run(app, host="0.0.0.0", port=port)
