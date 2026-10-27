// High-resolution Christmas Greeting Card Exporter using native Canvas
export function downloadHolidayCard(wish) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1200x800 high-res card format
  canvas.width = 1200;
  canvas.height = 800;

  // Theme colors
  const themeId = wish.theme || "pine";
  let bgGradientStart = "#061f16";
  let bgGradientEnd = "#020c08";
  let accentColor = "#10b981";
  let goldColor = "#d4af37";

  if (themeId === "crimson") {
    bgGradientStart = "#2b080c";
    bgGradientEnd = "#120305";
    accentColor = "#f43f5e";
  } else if (themeId === "gold") {
    bgGradientStart = "#241803";
    bgGradientEnd = "#0e0901";
    accentColor = "#fbbf24";
  } else if (themeId === "starlight") {
    bgGradientStart = "#0a1829";
    bgGradientEnd = "#030811";
    accentColor = "#38bdf8";
  }

  // Draw background gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, bgGradientStart);
  grad.addColorStop(1, bgGradientEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  // Outer decorative gold border
  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 1140, 740);

  // Inner thin gold border
  ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(45, 45, 1110, 710);

  // Corner ornaments
  const corners = [
    [55, 55],
    [1145, 55],
    [55, 745],
    [1145, 745],
  ];
  ctx.fillStyle = goldColor;
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top header text
  ctx.textAlign = "center";
  ctx.fillStyle = goldColor;
  ctx.font = "bold 26px serif";
  ctx.fillText("CHRISTMAS WISHES · 2026", 600, 120);

  // Category kicker
  ctx.fillStyle = accentColor;
  ctx.font = "italic 20px sans-serif";
  const categoryLabel = (wish.category || "Holiday Wish").toUpperCase();
  ctx.fillText(`— ${categoryLabel} —`, 600, 160);

  // Message body text with word wrap
  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 36px serif";
  const message = `"${wish.message}"`;
  const maxWidth = 960;
  const lineHeight = 54;
  const words = message.split(" ");
  let line = "";
  let y = 290;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, 600, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 600, y);

  // Divider
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(350, y + 70);
  ctx.lineTo(850, y + 70);
  ctx.stroke();

  // Author & blessing
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "18px sans-serif";
  ctx.fillText("With warmest holiday blessings,", 600, y + 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText(wish.name || "Anonymous Friend", 600, y + 160);

  // Bottom seal / date
  ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
  ctx.font = "16px sans-serif";
  ctx.fillText("DECEMBER 2026 · COMMUNITY SANCTUARY", 600, 715);

  // Trigger download
  const link = document.createElement("a");
  link.download = `Christmas-Wish-${(wish.name || "2026").replace(/\s+/g, "_")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
