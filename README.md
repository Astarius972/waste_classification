# EcoScan — AI Waste Detection

Detect waste in photos or live camera feeds using **YOLO** object detection, then show decomposition time, environmental impact, recycling tips, and proper disposal methods.

**Features:** PowerPoint-style scroll presentation · 3D waste models · Live camera + upload · English & Mongolian · Modern results UI

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, TypeScript, Tailwind, Framer Motion, React Three Fiber |
| Backend | Python, FastAPI, OpenCV, Ultralytics |
| ML | YOLOv3 (OpenCV DNN) or YOLOv8+ (Ultralytics) |
| i18n | English + Mongolian (`frontend/src/i18n/`) |
| Version control | Git + GitHub |

---

## Project structure

```
.
├── frontend/          # Next.js app (presentation + scanner)
│   └── src/
│       ├── i18n/      # en.ts + mn.ts translations
│       ├── components/# Landing slides, 3D models, scanner
│       └── lib/
├── backend/
│   └── app/
│       ├── waste_info.py  # Waste metadata + label → waste_key mapping
│       └── ...
└── README.md
```

---

## Deploy to Vercel (frontend) — step by step

The **Next.js frontend** deploys to Vercel. The **Python API** must be hosted separately (Railway, Render, etc.) because Vercel does not run long-lived Python ML servers on the free tier.

### Step 1 — Push code to GitHub

```bash
git add .
git commit -m "EcoScan ready for deployment"
git push origin main
```

### Step 2 — Deploy the Python backend first

Example on **Render**:

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. **Root directory:** `backend`
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables from `backend/.env.example`
7. Deploy and copy the URL (e.g. `https://ecoscan-api.onrender.com`)

### Step 3 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. **Root Directory:** click Edit → set to `frontend`
4. **Framework Preset:** Next.js (auto-detected)
5. **Environment variables:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com` |

6. Click **Deploy**
7. When finished, open `https://your-project.vercel.app`

### Step 4 — Enable camera on production

Browsers require **HTTPS** for camera access. Vercel provides HTTPS automatically. Ensure `NEXT_PUBLIC_API_URL` points to your deployed backend and that backend CORS includes your Vercel domain:

```env
# backend/.env
CORS_ORIGINS=https://your-project.vercel.app,http://localhost:3000
```

### Step 5 — Redeploy after env changes

In Vercel: **Settings → Environment Variables** → edit → **Redeploy** the latest deployment.

---

## Managing waste detection data

There are **three layers** of data you can update:

### 1. Environmental text (decomposition, impact, recycling)

**Backend (API fallback — English):** edit `backend/app/waste_info.py`

Each entry has:

- `waste_key` — stable ID (e.g. `plastic_bottle`)
- `category`, `decomposition_time`, `environmental_impact`, etc.
- `aliases` — YOLO class names that map to this entry (e.g. `"bottle"`, `"cup"`)

**Frontend translations (EN + MN):** edit:

- `frontend/src/i18n/en.ts` → `waste` object
- `frontend/src/i18n/mn.ts` → `waste` object (same keys)

After adding a new waste type:

1. Add entry to `waste_info.py` with a unique `waste_key`
2. Add matching keys in `en.ts` and `mn.ts`
3. Restart backend; redeploy frontend

### 2. Detection model (what objects YOLO recognizes)

1. **Collect images** — photos of waste items you want to detect
2. **Label them** — use [Roboflow](https://roboflow.com), [CVAT](https://www.cvat.ai/), or [LabelImg](https://github.com/HumanSignal/labelImg)
3. **Export YOLO format** — one `.txt` label file per image
4. **Train:**

   ```bash
   yolo detect train data=your-data.yaml model=yolov8n.pt epochs=100 imgsz=640
   ```

5. Copy `runs/detect/train/weights/best.pt` → `backend/models/`
6. Update `MODEL_PATH` in `backend/.env`
7. Add class names from your dataset to `waste_info.py` aliases

**Public dataset:** [TACO (Trash Annotations in Context)](https://github.com/pedropro/TACO)

### 3. Label → category mapping (fix “unknown” detections)

If the model detects `"bottle"` but shows wrong info, add an alias in `waste_info.py`:

```python
aliases=("bottle", "water bottle", "plastic_bottle"),
```

Frontend mapping also lives in `frontend/src/lib/waste.ts` → `LABEL_TO_KEY`.

### Quick test after data changes

```bash
# Backend
curl http://localhost:8000/health

# Upload test image
curl -X POST http://localhost:8000/api/detect/upload -F "file=@test.jpg"
```

---

## Library recommendations

### Why not scikit-learn / KNN for this project?

The libraries you listed (`sklearn`, `KNeighborsClassifier`, `StandardScaler`) are excellent for **tabular classification** (features in, label out). Waste detection from photos is a **computer vision** problem: you need to find objects in pixels and classify them spatially.

| Approach | Best for | Limitation for waste detection |
|----------|----------|--------------------------------|
| KNN + hand-crafted features | Small tabular datasets | No bounding boxes; poor on raw photos |
| YOLO (v3–v11) | Real-time object detection in images/video | Needs labeled image dataset |
| Ultralytics | Training + inference + export | Easier than raw Darknet YOLOv3 |

**Recommended stack:**

| Purpose | Library |
|---------|---------|
| Web API | [FastAPI](https://fastapi.tiangolo.com/) |
| Inference | [Ultralytics](https://docs.ultralytics.com/) (YOLOv8+) or OpenCV DNN (YOLOv3) |
| Image I/O | OpenCV, Pillow |
| Training data | [TACO dataset](https://github.com/pedropro/TACO), Roboflow, or custom labels |
| Training | PyTorch + Ultralytics CLI, or Albumentations for augmentation |
| Evaluation | scikit-learn metrics *after* converting detections to labels |
| Model export | ONNX (optional, for edge deployment) |

**YOLOv3 vs newer YOLO:** You asked for YOLOv3 — this repo supports it via `DETECTOR_ENGINE=yolov3_opencv`. For new projects, **YOLOv8+** is faster to train, more accurate, and better documented. Use v3 if you have existing Darknet weights or coursework requirements.

**Keep sklearn for:** comparing classifiers on extracted features, or evaluating a secondary text/metadata model — not for primary image detection.

---

## Prerequisites

- **Node.js** 20+
- **Python** 3.10+
- **Git**
- Webcam (for live detection)
- ~500 MB disk for a small YOLO model

---

## Quick start

### 1. Clone (after pushing to GitHub)

```bash
git clone https://github.com/YOUR_USERNAME/ecoscan.git
cd ecoscan
```

### 2. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows — use cp on macOS/Linux
```

Download a model (Ultralytics will fetch on first run):

```bash
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
move yolov8n.pt models\   # Windows — use mv on macOS/Linux
```

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open http://localhost:3000

---

## Git & GitHub workflow

### First-time setup

```bash
cd ecoscan
git init
git add .
git commit -m "Initial commit: EcoScan waste detection app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecoscan.git
git push -u origin main
```

### Daily workflow

```bash
git pull
# ... work ...
git add .
git commit -m "Describe your change"
git push
```

### What not to commit

- `node_modules/`, `.venv/`, `.env`, `.env.local`
- Large model weights (`*.weights`, `*.pt`) — use Git LFS or download scripts instead

---

## Training a waste-specific model

1. **Dataset:** [TACO](https://github.com/pedropro/TACO) or label your own images in [Roboflow](https://roboflow.com/) / [CVAT](https://www.cvat.ai/).
2. **Format:** YOLO txt labels (class, x_center, y_center, width, height — normalized).
3. **Train (Ultralytics):**

   ```bash
   yolo detect train data=taco.yaml model=yolov8n.pt epochs=100 imgsz=640
   ```

4. Copy `runs/detect/train/weights/best.pt` to `backend/models/` and update `MODEL_PATH` in `.env`.
5. Extend `backend/app/waste_info.py` with class names from your dataset.

For **YOLOv3**, export Darknet weights or convert via community tools; place `yolov3.weights` + `yolov3.cfg` in `models/` and set `DETECTOR_ENGINE=yolov3_opencv`.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/detect/upload` | Multipart image upload |
| POST | `/api/detect/frame` | JSON `{ "image": "<base64>" }` for camera frames |

---

## Deployment notes

| Component | Host | Notes |
|-----------|------|-------|
| Frontend | **Vercel** | Set root to `frontend`, add `NEXT_PUBLIC_API_URL` |
| Backend | **Render / Railway / VPS** | Needs Python + model weights; GPU optional |
| HTTPS | Required | Camera API only works on HTTPS in production |

See **[Deploy to Vercel](#deploy-to-vercel-frontend--step-by-step)** above for full steps.

---

## Roadmap ideas

- Draw bounding boxes on the preview canvas
- Region-specific recycling rules (geo API)
- Git LFS or release assets for custom weights
- Docker Compose for one-command local dev

---

## License

MIT (adjust as needed)
#   w a s t e _ c l a s s i f i c a t i o n  
 