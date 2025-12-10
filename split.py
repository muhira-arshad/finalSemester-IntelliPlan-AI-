import os
import random
import shutil
from tqdm import tqdm

# Base folders
images_dir = r"D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks\images"
masks_dir = r"D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks\masks"

# Output base folder
output_base = r"D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks"

splits = ['train', 'val', 'test']
for split in splits:
    os.makedirs(os.path.join(output_base, split, 'images'), exist_ok=True)
    os.makedirs(os.path.join(output_base, split, 'masks'), exist_ok=True)

# Collect all model files
all_images = sorted([f for f in os.listdir(images_dir) if f.endswith(".png")])
all_masks = sorted([f for f in os.listdir(masks_dir) if f.endswith(".png")])

# Ensure both have same count
assert len(all_images) == len(all_masks), "❌ Mismatch between image and mask count!"

# Shuffle for randomness
data_pairs = list(zip(all_images, all_masks))
random.shuffle(data_pairs)

# Split ratio
total = len(data_pairs)
train_split = int(0.8 * total)
val_split = int(0.1 * total)

train_data = data_pairs[:train_split]
val_data = data_pairs[train_split:train_split + val_split]
test_data = data_pairs[train_split + val_split:]

def copy_pairs(pairs, split):
    print(f"\n📦 Copying {split} set ({len(pairs)} samples)...")
    for img, mask in tqdm(pairs):
        shutil.copy(os.path.join(images_dir, img), os.path.join(output_base, split, 'images', img))
        shutil.copy(os.path.join(masks_dir, mask), os.path.join(output_base, split, 'masks', mask))

# Copy files
copy_pairs(train_data, 'train')
copy_pairs(val_data, 'val')
copy_pairs(test_data, 'test')

print("\n🎉 Dataset split complete!")
print(f"📁 Output saved to: {output_base}")