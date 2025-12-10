"""
train_dimension_model_v2.py — Fine-tuning with category support

Input: label + category  (no RGB)
Output: width_ft, height_ft (regression)
"""

import os
import json
import random
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torch.optim as optim
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

# ---------------- CONFIG ----------------
DATA_PATH = r"D:\Zainab\FYP\dataset-working-test\final-dimensions.json"
SAVE_DIR = r"D:\Zainab\FYP\dataset-working-test\dimension_model_v2"

RANDOM_SEED = 42
BATCH_SIZE = 64
EPOCHS = 300
LR = 5e-4
EMBED_DIM = 64
HIDDEN = 128
WEIGHT_DECAY = 1e-5
USE_RGB = False        # ⬅️ turn off RGB since not in your dataset
VAL_SPLIT = 0.1
TEST_SPLIT = 0.1

os.makedirs(SAVE_DIR, exist_ok=True)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Device:", device)

# ---------------- DATASET ----------------
class DimensionDataset(Dataset):
    def __init__(self, samples, label2idx, category2idx, rgb_scaler=None, target_scaler=None, use_rgb=False):
        self.samples = samples
        self.label2idx = label2idx
        self.category2idx = category2idx
        self.use_rgb = use_rgb
        self.rgb_scaler = rgb_scaler
        self.target_scaler = target_scaler

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, i):
        s = self.samples[i]
        label_idx = self.label2idx[s["label"]]
        category_idx = self.category2idx[s["category"]]

        rgb = np.array(s.get("rgb", [0, 0, 0]), dtype=np.float32).reshape(1, -1)
        if self.use_rgb and self.rgb_scaler is not None:
            rgb = self.rgb_scaler.transform(rgb)[0]
        else:
            rgb = np.zeros(3, dtype=np.float32)

        target = np.array([s["width_ft"], s["height_ft"]], dtype=np.float32).reshape(1, -1)
        if self.target_scaler is not None:
            target = self.target_scaler.transform(target)[0]

        return {
            "label_idx": torch.tensor(label_idx, dtype=torch.long),
            "category_idx": torch.tensor(category_idx, dtype=torch.long),
            "rgb": torch.tensor(rgb, dtype=torch.float32),
            "target": torch.tensor(target, dtype=torch.float32)
        }

# ---------------- LOAD & CLEAN DATA ----------------
def load_and_clean(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    cleaned = []
    for d in data:
        label = d.get("label")
        category = d.get("category")
        if not label or not category:
            continue
        w, h = d.get("width_ft"), d.get("height_ft")
        if w is None or h is None:
            continue
        try:
            w, h = float(w), float(h)
        except:
            continue
        if w <= 0 or h <= 0 or w > 200 or h > 200:
            continue
        cleaned.append({"label": label.strip(), "category": category.strip(), "width_ft": w, "height_ft": h})

    print(f"Loaded {len(data)} raw → {len(cleaned)} cleaned samples")
    return cleaned

# ---------------- INIT ----------------
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)
torch.manual_seed(RANDOM_SEED)

samples = load_and_clean(DATA_PATH)
labels = sorted({s["label"] for s in samples})
categories = sorted({s["category"] for s in samples})

label2idx = {lab: i for i, lab in enumerate(labels)}
category2idx = {cat: i for i, cat in enumerate(categories)}

print(f"{len(labels)} unique labels | {len(categories)} unique categories")

target_arr = np.array([[s["width_ft"], s["height_ft"]] for s in samples], dtype=np.float32)
target_scaler = StandardScaler().fit(target_arr)

# Save scaler
np.save(os.path.join(SAVE_DIR, "target_scaler_mean_std.npy"),
        np.vstack([target_scaler.mean_, target_scaler.scale_]))

# ---------------- SPLIT DATA ----------------
N = len(samples)
n_test = int(N * TEST_SPLIT)
n_val = int(N * VAL_SPLIT)
n_train = N - n_val - n_test

random.shuffle(samples)
train_samples = samples[:n_train]
val_samples = samples[n_train:n_train+n_val]
test_samples = samples[n_train+n_val:]

train_ds = DimensionDataset(train_samples, label2idx, category2idx, None, target_scaler, USE_RGB)
val_ds   = DimensionDataset(val_samples, label2idx, category2idx, None, target_scaler, USE_RGB)
test_ds  = DimensionDataset(test_samples, label2idx, category2idx, None, target_scaler, USE_RGB)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE)
test_loader = DataLoader(test_ds, batch_size=BATCH_SIZE)

# ---------------- MODEL ----------------
class DimModel(nn.Module):
    def __init__(self, n_labels, n_categories, embed_dim=64, use_rgb=False):
        super().__init__()
        self.use_rgb = use_rgb
        self.label_embed = nn.Embedding(n_labels, embed_dim)
        self.category_embed = nn.Embedding(n_categories, embed_dim)
        input_dim = embed_dim * 2 + (3 if use_rgb else 0)
        self.net = nn.Sequential(
            nn.Linear(input_dim, HIDDEN),
            nn.ReLU(),
            nn.Linear(HIDDEN, HIDDEN),
            nn.ReLU(),
            nn.Linear(HIDDEN, 2)
        )

    def forward(self, label_idx, category_idx, rgb=None):
        e_label = self.label_embed(label_idx)
        e_cat = self.category_embed(category_idx)
        x = torch.cat([e_label, e_cat], dim=1)
        if self.use_rgb and rgb is not None:
            x = torch.cat([x, rgb], dim=1)
        return self.net(x)

model = DimModel(len(labels), len(categories), EMBED_DIM, USE_RGB).to(device)
optimizer = optim.Adam(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
criterion = nn.MSELoss()

# ---------------- TRAIN LOOP ----------------
best_val = float("inf")
train_losses, val_losses = [], []

for epoch in range(1, EPOCHS + 1):
    model.train()
    total_train = 0
    for batch in train_loader:
        lab = batch["label_idx"].to(device)
        cat = batch["category_idx"].to(device)
        rgb = batch["rgb"].to(device) if USE_RGB else None
        tgt = batch["target"].to(device)

        pred = model(lab, cat, rgb)
        loss = criterion(pred, tgt)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_train += loss.item() * lab.size(0)

    train_loss = total_train / len(train_ds)
    train_losses.append(train_loss)

    model.eval()
    total_val = 0
    with torch.no_grad():
        for batch in val_loader:
            lab = batch["label_idx"].to(device)
            cat = batch["category_idx"].to(device)
            rgb = batch["rgb"].to(device) if USE_RGB else None
            tgt = batch["target"].to(device)
            pred = model(lab, cat, rgb)
            total_val += criterion(pred, tgt).item() * lab.size(0)

    val_loss = total_val / len(val_ds)
    val_losses.append(val_loss)

    if epoch % 10 == 0 or epoch == 1:
        print(f"Epoch {epoch}/{EPOCHS} | Train={train_loss:.6f} | Val={val_loss:.6f}")

    if val_loss < best_val:
        best_val = val_loss
        torch.save({
            "model_state": model.state_dict(),
            "label2idx": label2idx,
            "category2idx": category2idx,
            "target_mean": target_scaler.mean_.tolist(),
            "target_std": target_scaler.scale_.tolist(),
            "use_rgb": USE_RGB
        }, os.path.join(SAVE_DIR, "dimension_model_best.pth"))
        print(f"✅ Saved better model at epoch {epoch} (val={val_loss:.6f})")

# ---------------- EVALUATE ----------------
def unscale_target(scaled):
    return scaled * target_scaler.scale_ + target_scaler.mean_

model.eval()
preds, trues = [], []
with torch.no_grad():
    for batch in test_loader:
        lab = batch["label_idx"].to(device)
        cat = batch["category_idx"].to(device)
        rgb = batch["rgb"].to(device) if USE_RGB else None
        pred = model(lab, cat, rgb).cpu().numpy()
        true = batch["target"].cpu().numpy()
        preds.append(unscale_target(pred))
        trues.append(unscale_target(true))

preds = np.vstack(preds)
trues = np.vstack(trues)
mae_w = np.mean(np.abs(preds[:, 0] - trues[:, 0]))
mae_h = np.mean(np.abs(preds[:, 1] - trues[:, 1]))
print(f"📏 Test MAE: width={mae_w:.3f} ft, height={mae_h:.3f} ft on {len(test_ds)} samples")

plt.figure(figsize=(6,4))
plt.plot(train_losses, label="train")
plt.plot(val_losses, label="val")
plt.xlabel("Epoch")
plt.ylabel("Loss (MSE)")
plt.title("Training Losses (Label + Category)")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(SAVE_DIR, "training_losses.png"))
print("✅ Model and plots saved in:", SAVE_DIR)
