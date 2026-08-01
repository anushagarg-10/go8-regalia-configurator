/**
 * Composes the live 3D canvas into a branded, downloadable "graduation
 * card" PNG (1080x1350, portrait). Pure client-side canvas work.
 */

export interface LookCardInfo {
  universityName: string;
  levelLabel: string;
  facultyLabel?: string;
}

export async function composeLookCard(
  source: HTMLCanvasElement,
  info: LookCardInfo,
): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const card = document.createElement("canvas");
  card.width = W;
  card.height = H;
  const ctx = card.getContext("2d");
  if (!ctx) return null;

  // Cream backdrop with a subtle bottom band
  ctx.fillStyle = "#f6f1e8";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#6d1f35";
  ctx.fillRect(0, H - 14, W, 14);

  // Wordmark
  ctx.textAlign = "left";
  ctx.fillStyle = "#6d1f35";
  ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
  ctx.fillText("Grad", 64, 104);
  const gradWidth = ctx.measureText("Grad").width;
  ctx.fillStyle = "#b98c3a";
  ctx.font = "64px Caveat, cursive";
  ctx.fillText("Choice", 64 + gradWidth + 14, 104);

  // The 3D render, fitted into a framed area
  const frame = { x: 60, y: 150, w: W - 120, h: 860 };
  const scale = Math.min(frame.w / source.width, frame.h / source.height);
  const dw = source.width * scale;
  const dh = source.height * scale;
  const dx = frame.x + (frame.w - dw) / 2;
  const dy = frame.y + (frame.h - dh) / 2;
  ctx.fillStyle = "#ece4d4";
  ctx.fillRect(frame.x, frame.y, frame.w, frame.h);
  ctx.drawImage(source, dx, dy, dw, dh);
  ctx.strokeStyle = "rgba(33,29,25,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);

  // Caption
  ctx.textAlign = "center";
  ctx.fillStyle = "#211d19";
  ctx.font = "bold 46px 'Playfair Display', Georgia, serif";
  ctx.fillText(info.universityName, W / 2, 1105, W - 120);
  ctx.fillStyle = "#6b6259";
  ctx.font = "30px Geist, system-ui, sans-serif";
  const line2 = info.facultyLabel
    ? `${info.levelLabel} · ${info.facultyLabel}`
    : `${info.levelLabel} regalia`;
  ctx.fillText(line2, W / 2, 1160, W - 120);
  ctx.fillStyle = "rgba(107,98,89,0.7)";
  ctx.font = "22px Geist, system-ui, sans-serif";
  ctx.fillText("Colours are approximations. Confirm with your university.", W / 2, 1250, W - 120);

  return new Promise((resolve) => card.toBlob(resolve, "image/png"));
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
