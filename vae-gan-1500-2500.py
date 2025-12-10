# improved_vae_gan_next1000.py
import os
import random
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
from tqdm import tqdm
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, utils

# ========== CONFIG ==========
TRAIN_PATH = r"D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks\train\masks"
VAL_PATH = r"D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks\val\masks"
SAVE_PATH = r"D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks\model-epochs-1500-2500"

BATCH_SIZE = 4
EPOCHS = 130               # Continue for 60 more (you can adjust)
IMAGE_SIZE = 64
LATENT_DIM = 128
START_INDEX = 1500           # Skip first 500 images
MAX_TRAIN_IMAGES = 1000     # Train on next 1000 (501–1500)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
PRINT_EVERY = 1
SAVE_EVERY = 5
SEED = 42
PREV_CHECKPOINT = os.path.join(SAVE_PATH, "D:\Zainab\FYP\IntelliPlan-AI\images_masks\images_masks\model-epochs-500-1500\checkpoint_cont_epoch100.pth")

os.makedirs(SAVE_PATH, exist_ok=True)

# ========== REPRODUCIBILITY ==========
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)

# ========== DATASET CLASS ==========
class ImageDataset(Dataset):
    def __init__(self, folder, start_idx=0, max_images=None, image_size=IMAGE_SIZE):
        files = [os.path.join(folder, f) for f in os.listdir(folder)
                 if f.lower().endswith(('.jpg', '.png', '.jpeg'))]
        files = sorted(files)
        if max_images:
            files = files[start_idx:start_idx + max_images]
        else:
            files = files[start_idx:]
        self.files = files
        self.transform = transforms.Compose([
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
        ])

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        img = Image.open(self.files[idx]).convert("RGB")
        return self.transform(img)

# ========== LOAD DATA ==========
train_set = ImageDataset(TRAIN_PATH, start_idx=START_INDEX, max_images=MAX_TRAIN_IMAGES)
val_set = ImageDataset(VAL_PATH)

loader = DataLoader(train_set, batch_size=BATCH_SIZE, shuffle=True, drop_last=True)
val_loader = DataLoader(val_set, batch_size=1)

print(f"✅ Using {len(train_set)} train images and {len(val_set)} val images.")
print(f"Device: {DEVICE}")

# ========== MODELS ==========
class Encoder(nn.Module):
    def __init__(self, latent_dim):
        super().__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 64, 4, 2, 1), nn.ReLU(inplace=True),
            nn.Conv2d(64, 128, 4, 2, 1), nn.BatchNorm2d(128), nn.ReLU(inplace=True),
            nn.Conv2d(128, 256, 4, 2, 1), nn.BatchNorm2d(256), nn.ReLU(inplace=True),
            nn.Flatten()
        )
        self.fc_mu = nn.Linear(256 * (IMAGE_SIZE // 8) * (IMAGE_SIZE // 8), latent_dim)
        self.fc_logvar = nn.Linear(256 * (IMAGE_SIZE // 8) * (IMAGE_SIZE // 8), latent_dim)

    def forward(self, x):
        h = self.model(x)
        return self.fc_mu(h), self.fc_logvar(h)

class Decoder(nn.Module):
    def __init__(self, latent_dim):
        super().__init__()
        self.fc = nn.Linear(latent_dim, 256 * (IMAGE_SIZE // 8) * (IMAGE_SIZE // 8))
        self.model = nn.Sequential(
            nn.ConvTranspose2d(256, 128, 4, 2, 1), nn.BatchNorm2d(128), nn.ReLU(inplace=True),
            nn.ConvTranspose2d(128, 64, 4, 2, 1), nn.BatchNorm2d(64), nn.ReLU(inplace=True),
            nn.ConvTranspose2d(64, 3, 4, 2, 1), nn.Sigmoid()
        )

    def forward(self, z):
        h = self.fc(z)
        h = h.view(-1, 256, IMAGE_SIZE // 8, IMAGE_SIZE // 8)
        return self.model(h)

class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 64, 4, 2, 1), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(64, 128, 4, 2, 1), nn.BatchNorm2d(128), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(128, 256, 4, 2, 1), nn.BatchNorm2d(256), nn.LeakyReLU(0.2, inplace=True),
        )
        self.fc = nn.Linear(256 * (IMAGE_SIZE // 8) * (IMAGE_SIZE // 8), 1)

    def forward(self, x):
        h = self.model(x)
        h = h.view(x.size(0), -1)
        return self.fc(h)

encoder = Encoder(LATENT_DIM).to(DEVICE)
decoder = Decoder(LATENT_DIM).to(DEVICE)
discriminator = Discriminator().to(DEVICE)

# ========== LOAD PREVIOUS CHECKPOINT ==========
if os.path.exists(PREV_CHECKPOINT):
    checkpoint = torch.load(PREV_CHECKPOINT, map_location=DEVICE)
    encoder.load_state_dict(checkpoint['encoder'])
    decoder.load_state_dict(checkpoint['decoder'])
    discriminator.load_state_dict(checkpoint['discriminator'])
    print(f"✅ Loaded previous model weights from {PREV_CHECKPOINT}")
else:
    print("⚠️ No previous checkpoint found! Training from scratch.")

# ========== OPTIMIZERS & LOSSES ==========
optimizer_G = optim.Adam(list(encoder.parameters()) + list(decoder.parameters()), lr=2e-4, betas=(0.5, 0.999))
optimizer_D = optim.Adam(discriminator.parameters(), lr=2e-4, betas=(0.5, 0.999))
recon_loss_fn = nn.MSELoss()
adv_loss_fn = nn.BCEWithLogitsLoss()

# ========== HELPERS ==========
def reparameterize(mu, logvar):
    std = torch.exp(0.5 * logvar)
    eps = torch.randn_like(std)
    return mu + eps * std

def save_checkpoint(epoch):
    torch.save({
        'encoder': encoder.state_dict(),
        'decoder': decoder.state_dict(),
        'discriminator': discriminator.state_dict(),
        'epoch': epoch
    }, os.path.join(SAVE_PATH, f"checkpoint_cont_epoch{epoch}.pth"))
    print(f"[Checkpoint] Saved models for epoch {epoch}")

def sample_and_save(epoch):
    encoder.eval()
    decoder.eval()
    with torch.no_grad():
        z = torch.randn(BATCH_SIZE, LATENT_DIM, device=DEVICE)
        gen = decoder(z).cpu()

        real_imgs = []
        for i, batch in enumerate(val_loader):
            img = batch[0] if isinstance(batch, (list, tuple)) else batch
            if img.dim() == 3:
                img = img.unsqueeze(0)
            if img.shape[1] != 3:
                img = img[:, :3, :, :]
            real_imgs.append(img)
            if len(real_imgs) >= BATCH_SIZE:
                break
        real_imgs = torch.cat(real_imgs, dim=0).to(DEVICE)

        mu, logvar = encoder(real_imgs)
        z = reparameterize(mu, logvar)
        recon = decoder(z).cpu()
        real_imgs = real_imgs.cpu()

        comparison = torch.cat([real_imgs, recon], dim=0)
        utils.save_image(comparison, os.path.join(SAVE_PATH, f"comparison_cont_epoch{epoch}.png"),
                         nrow=BATCH_SIZE, normalize=True)

        grid = utils.make_grid(gen, nrow=4, normalize=True)
        utils.save_image(grid, os.path.join(SAVE_PATH, f"sample_cont_epoch{epoch}.png"))
    encoder.train()
    decoder.train()

# ========== TRAIN ==========
loss_history = {"recon": [], "adv": [], "kl": []}
real_label_val, fake_label_val = 0.9, 0.0

for epoch in range(1, EPOCHS + 1):
    recon_losses, adv_losses, kl_losses = [], [], []
    pbar = tqdm(loader, desc=f"Continued Epoch {epoch}/{EPOCHS}")
    for imgs in pbar:
        imgs = imgs.to(DEVICE)

        mu, logvar = encoder(imgs)
        z = reparameterize(mu, logvar)
        recon = decoder(z)

        recon_loss = recon_loss_fn(recon, imgs)
        kl_loss = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())

        optimizer_D.zero_grad()
        logits_real = discriminator(imgs)
        logits_fake = discriminator(recon.detach())
        real_labels = torch.full((imgs.size(0), 1), real_label_val, device=DEVICE)
        fake_labels = torch.full((imgs.size(0), 1), fake_label_val, device=DEVICE)
        loss_D_real = adv_loss_fn(logits_real, real_labels)
        loss_D_fake = adv_loss_fn(logits_fake, fake_labels)
        loss_D = (loss_D_real + loss_D_fake) * 0.5
        loss_D.backward()
        optimizer_D.step()

        optimizer_G.zero_grad()
        logits_fake_G = discriminator(recon)
        adv_loss = adv_loss_fn(logits_fake_G, real_labels) if epoch >= 10 else torch.tensor(0.0, device=DEVICE)
        loss_G = recon_loss + 0.01 * adv_loss + 0.1 * kl_loss
        loss_G.backward()
        optimizer_G.step()

        recon_losses.append(recon_loss.item())
        adv_losses.append(adv_loss.item())
        kl_losses.append(kl_loss.item())

    mean_recon = np.mean(recon_losses)
    mean_adv = np.mean(adv_losses)
    mean_kl = np.mean(kl_losses)
    loss_history["recon"].append(mean_recon)
    loss_history["adv"].append(mean_adv)
    loss_history["kl"].append(mean_kl)

    print(f"Epoch {epoch}/{EPOCHS} | Recon: {mean_recon:.6f} | Adv: {mean_adv:.6f} | KL: {mean_kl:.6f}")

    if epoch % SAVE_EVERY == 0:
        sample_and_save(epoch)
        save_checkpoint(epoch)

# Save final
torch.save(encoder.state_dict(), os.path.join(SAVE_PATH, "encoder_final_cont.pth"))
torch.save(decoder.state_dict(), os.path.join(SAVE_PATH, "decoder_final_cont.pth"))
torch.save(discriminator.state_dict(), os.path.join(SAVE_PATH, "discriminator_final_cont.pth"))

plt.figure(figsize=(8, 4))
plt.plot(loss_history["recon"], label="Recon")
plt.plot(loss_history["adv"], label="Adv")
plt.plot(loss_history["kl"], label="KL")
plt.legend()
plt.title("Continued Training Losses")
plt.savefig(os.path.join(SAVE_PATH, "losses_cont.png"))
print("🎨 Continued training complete — all models and samples saved to:", SAVE_PATH)
