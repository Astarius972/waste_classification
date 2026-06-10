"""Fine-tune an ImageNet-pretrained classifier (MobileNetV2 or EfficientNetB0)
on the Kaggle garbage-classification dataset.

Run scripts/prepare_garbage_dataset.py first.

Usage (from backend/):
    .venv/Scripts/python.exe scripts/train_garbage_classifier.py
    .venv/Scripts/python.exe scripts/train_garbage_classifier.py --arch efficientnet_b0

The best checkpoint is saved to models/garbage_classifier.pt as a dict:
    {"arch": ..., "classes": [...], "state_dict": ...}
"""

from __future__ import annotations

import argparse
import copy
import time
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms

BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = BACKEND_ROOT / "datasets" / "garbage"
OUTPUT_MODEL = BACKEND_ROOT / "models" / "garbage_classifier.pt"

EPOCHS = 12
BATCH_SIZE = 32
LR_HEAD = 1e-3
LR_BACKBONE = 1e-4

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]


def build_model(arch: str, num_classes: int) -> tuple[nn.Module, nn.Module]:
    """Return (model, classifier_head) with the head replaced for our classes."""
    if arch == "mobilenet_v2":
        model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V2)
        model.classifier[1] = nn.Linear(model.last_channel, num_classes)
        head = model.classifier
    elif arch == "efficientnet_b0":
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
        head = model.classifier
    else:
        raise ValueError(f"Unsupported arch: {arch}")
    return model, head


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--arch",
        default="mobilenet_v2",
        choices=("mobilenet_v2", "efficientnet_b0"),
    )
    parser.add_argument("--epochs", type=int, default=EPOCHS)
    args = parser.parse_args()

    if not DATASET_DIR.exists():
        raise SystemExit("Dataset not found. Run scripts/prepare_garbage_dataset.py first.")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training {args.arch} on {device}")

    train_tf = transforms.Compose(
        [
            transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.2),
            transforms.RandomRotation(12),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ]
    )
    val_tf = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ]
    )

    train_ds = datasets.ImageFolder(DATASET_DIR / "train", transform=train_tf)
    val_ds = datasets.ImageFolder(DATASET_DIR / "val", transform=val_tf)
    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=2)
    classes = train_ds.classes
    print(f"Classes: {classes}")
    print(f"{len(train_ds)} train / {len(val_ds)} val images")

    model, head = build_model(args.arch, len(classes))
    model.to(device)

    head_params = {id(p) for p in head.parameters()}
    backbone_params = [p for p in model.parameters() if id(p) not in head_params]
    optimizer = torch.optim.AdamW(
        [
            {"params": backbone_params, "lr": LR_BACKBONE},
            {"params": head.parameters(), "lr": LR_HEAD},
        ],
        weight_decay=1e-4,
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

    best_acc = 0.0
    best_state: dict | None = None

    for epoch in range(1, args.epochs + 1):
        start = time.time()
        model.train()
        running_loss = 0.0
        for images, targets in train_loader:
            images, targets = images.to(device), targets.to(device)
            optimizer.zero_grad()
            loss = criterion(model(images), targets)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * images.size(0)
        scheduler.step()

        model.eval()
        correct = 0
        with torch.no_grad():
            for images, targets in val_loader:
                images, targets = images.to(device), targets.to(device)
                preds = model(images).argmax(dim=1)
                correct += (preds == targets).sum().item()
        val_acc = correct / len(val_ds)

        if val_acc > best_acc:
            best_acc = val_acc
            best_state = copy.deepcopy(model.state_dict())

        print(
            f"epoch {epoch:2d}/{args.epochs}  "
            f"loss {running_loss / len(train_ds):.4f}  "
            f"val_acc {val_acc:.4f}  "
            f"best {best_acc:.4f}  "
            f"({time.time() - start:.0f}s)",
            flush=True,
        )

    OUTPUT_MODEL.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {"arch": args.arch, "classes": classes, "state_dict": best_state},
        OUTPUT_MODEL,
    )
    print(f"\nBest val accuracy: {best_acc:.4f}")
    print(f"Best weights copied to {OUTPUT_MODEL}")
    print("Restart the backend to start using the classifier.")


if __name__ == "__main__":
    main()
