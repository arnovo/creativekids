export function hexToRgba(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return { r, g, b, a: 255 };
}

export async function createFloodFillImage(canvasEl, startX, startY, fillColorHex) {
  const width = canvasEl.width;
  const height = canvasEl.height;
  
  const srcCtx = canvasEl.getContext('2d', { willReadFrequently: true });
  const srcData = srcCtx.getImageData(0, 0, width, height);
  const srcPixels = srcData.data;

  const destData = new ImageData(width, height);
  const destPixels = destData.data;
  
  const fillRgba = hexToRgba(fillColorHex);
  
  const getIndex = (x, y) => (y * width + x) * 4;
  
  // Asegurarse de que el clic está dentro del lienzo
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return null;

  const startIdx = getIndex(startX, startY);
  const startR = srcPixels[startIdx];
  const startG = srcPixels[startIdx + 1];
  const startB = srcPixels[startIdx + 2];
  const startA = srcPixels[startIdx + 3];

  const colorMatch = (r, g, b, a) => {
    if (startA < 10 && a < 10) return true;
    return Math.abs(r - startR) < 40 && Math.abs(g - startG) < 40 && Math.abs(b - startB) < 40 && Math.abs(a - startA) < 40;
  };
  
  if (colorMatch(fillRgba.r, fillRgba.g, fillRgba.b, fillRgba.a) && startA >= 200) {
    return null;
  }
  
  // Evitar rellenar si hace clic justo en la línea negra
  if (startA > 200 && startR < 50 && startG < 50 && startB < 50) {
      return null;
  }

  const stack = [{ x: startX, y: startY }];
  const visited = new Uint8Array(width * height);
  visited[startY * width + startX] = 1;
  
  let painted = false;

  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const idx = getIndex(x, y);
    const r = srcPixels[idx];
    const g = srcPixels[idx + 1];
    const b = srcPixels[idx + 2];
    const a = srcPixels[idx + 3];
    
    if (colorMatch(r, g, b, a)) {
      destPixels[idx] = fillRgba.r;
      destPixels[idx + 1] = fillRgba.g;
      destPixels[idx + 2] = fillRgba.b;
      destPixels[idx + 3] = fillRgba.a;
      
      painted = true;
      
      if (x > 0 && !visited[y * width + (x - 1)]) {
        stack.push({ x: x - 1, y });
        visited[y * width + (x - 1)] = 1;
      }
      if (x < width - 1 && !visited[y * width + (x + 1)]) {
        stack.push({ x: x + 1, y });
        visited[y * width + (x + 1)] = 1;
      }
      if (y > 0 && !visited[(y - 1) * width + x]) {
        stack.push({ x, y: y - 1 });
        visited[(y - 1) * width + x] = 1;
      }
      if (y < height - 1 && !visited[(y + 1) * width + x]) {
        stack.push({ x, y: y + 1 });
        visited[(y + 1) * width + x] = 1;
      }
    }
  }
  
  if (!painted) return null;

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const tmpCtx = tmpCanvas.getContext('2d');
  tmpCtx.putImageData(destData, 0, 0);
  
  return tmpCanvas.toDataURL('image/png');
}
