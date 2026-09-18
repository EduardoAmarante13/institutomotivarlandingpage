from PIL import Image
import numpy as np
from collections import deque

img = Image.open('/app/frontend/public/logo.png').convert('RGBA')
arr = np.array(img)
h, w = arr.shape[:2]
rgb = arr[:, :, :3].astype(int)

near_white = (rgb[:, :, 0] > 232) & (rgb[:, :, 1] > 232) & (rgb[:, :, 2] > 232)

visited = np.zeros((h, w), bool)
dq = deque()
for x in range(w):
    for y in (0, h - 1):
        if near_white[y, x] and not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if near_white[y, x] and not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))

while dq:
    y, x = dq.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and near_white[ny, nx] and not visited[ny, nx]:
            visited[ny, nx] = True
            dq.append((ny, nx))

arr[:, :, 3] = np.where(visited, 0, 255)

# Suaviza borda: pixels quase brancos adjacentes ganham alpha proporcional
edge = near_white & ~visited
lum = rgb[edge].mean(axis=1)
arr[:, :, 3][edge] = np.clip((255 - lum) * 8, 0, 255).astype(np.uint8)

alpha = arr[:, :, 3]
ys, xs = np.where(alpha > 10)
pad = 10
y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad + 1)
x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad + 1)
out = Image.fromarray(arr[y0:y1, x0:x1])
out.save('/app/frontend/public/logo.png')
print('OK', out.size)
