# Model files

Place your trained YOLO weights here. Do **not** commit large binary files to Git.

## Option A — YOLOv3 (OpenCV DNN)

Download from the [YOLOv3 release page](https://github.com/pjreddie/darknet):

- `yolov3.weights`
- `yolov3.cfg` (from the darknet repo `cfg/` folder)
- `coco.names` (class labels)

For **waste-specific** detection, fine-tune on a dataset such as [TACO](https://github.com/pedropro/TACO) and replace these files with your custom weights.

## Option B — YOLOv8+ (Ultralytics, recommended)

```bash
# Example: download a pre-trained nano model (for prototyping)
pip install ultralytics
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

Copy the resulting `.pt` file here and set `MODEL_PATH` in `backend/.env`.
