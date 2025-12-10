"""
test_dimension_model.py — Load and test the trained dimension regression model
"""

import torch
import numpy as np

# --- Load model checkpoint ---
ckpt_path = r"D:\Zainab\FYP\dataset-working-test\dimension_model_v2\dimension_model_best.pth"
checkpoint = torch.load(ckpt_path, map_location="cpu")

# --- Rebuild the model structure ---
class DimModel(torch.nn.Module):
    def __init__(self, n_labels, n_categories, embed_dim=64, use_rgb=False):
        super().__init__()
        self.use_rgb = use_rgb
        self.label_embed = torch.nn.Embedding(n_labels, embed_dim)
        self.category_embed = torch.nn.Embedding(n_categories, embed_dim)
        input_dim = embed_dim * 2 + (3 if use_rgb else 0)
        self.net = torch.nn.Sequential(
            torch.nn.Linear(input_dim, 128),
            torch.nn.ReLU(),
            torch.nn.Linear(128, 128),
            torch.nn.ReLU(),
            torch.nn.Linear(128, 2)
        )

    def forward(self, label_idx, category_idx, rgb=None):
        e_label = self.label_embed(label_idx)
        e_cat = self.category_embed(category_idx)
        x = torch.cat([e_label, e_cat], dim=1)
        if self.use_rgb and rgb is not None:
            x = torch.cat([x, rgb], dim=1)
        return self.net(x)

# --- Recreate and load weights ---
model = DimModel(
    n_labels=len(checkpoint["label2idx"]),
    n_categories=len(checkpoint["category2idx"]),
    use_rgb=checkpoint["use_rgb"]
)
model.load_state_dict(checkpoint["model_state"])
model.eval()

# --- Load saved mappings and scalers ---
label2idx = checkpoint["label2idx"]
category2idx = checkpoint["category2idx"]
target_mean = np.array(checkpoint["target_mean"])
target_std = np.array(checkpoint["target_std"])

def unscale_target(pred):
    return pred * target_std + target_mean

# --- Helper function for prediction ---
def predict_dimension(label, category):
    if label not in label2idx:
        print(f"⚠️ Label '{label}' not found — using category embedding only.")
        label_idx = torch.tensor([0])  # fallback
    else:
        label_idx = torch.tensor([label2idx[label]])

    if category not in category2idx:
        print(f"⚠️ Category '{category}' not found — using default category.")
        category_idx = torch.tensor([0])
    else:
        category_idx = torch.tensor([category2idx[category]])

    with torch.no_grad():
        pred_scaled = model(label_idx, category_idx).numpy()[0]
        pred_unscaled = unscale_target(pred_scaled)
    return pred_unscaled

# --- Example predictions ---
examples = [
    ("bedroom", "bedroom"),
    ("makuuhuone", "bedroom"),       
    ("bathroom", "bathroom"),
    ("kitchen", "kitchen"),
    ("living", "livingroom"),
    ("dining", "livingroom"),
    ("tk/kuisti", "balcony"),
    ("terrace", "balcony"),
    ("ruokailu","kitchen"),
    ("vh/sh","storage")
]

for label, category in examples:
    pred = predict_dimension(label, category)
    print(f"{label:<15} ({category:<12}) → Width ≈ {pred[0]:.2f} ft | Height ≈ {pred[1]:.2f} ft")
