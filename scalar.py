import torch
import pickle
from sklearn.preprocessing import StandardScaler
import numpy as np
import os

# --- Paths ---
model_dir = r"D:\Zainab\FYP\dataset-working-test\dimension_model"
checkpoint_path = os.path.join(model_dir, "dimension_model_final.pth")

# --- Load the checkpoint ---
chkpt = torch.load(checkpoint_path, map_location="cpu")
print("✅ Loaded checkpoint keys:", list(chkpt.keys()))

# --- Rebuild scalers ---
target_mean = np.array(chkpt["target_mean"])
target_std = np.array(chkpt["target_std"])

target_scaler = StandardScaler()
target_scaler.mean_ = target_mean
target_scaler.scale_ = target_std
target_scaler.var_ = target_std ** 2

# Save target scaler
with open(os.path.join(model_dir, "target_scaler.pkl"), "wb") as f:
    pickle.dump(target_scaler, f)

print("✅ target_scaler.pkl saved to:", model_dir)
