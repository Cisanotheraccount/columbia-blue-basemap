'use strict';

const views = {
  morningside: { center: [-73.9626, 40.8080], zoom: 15.8 },
  manhattanville: { center: [-73.9578, 40.8179], zoom: 16 },
  cuimc: { center: [-73.9411, 40.8402], zoom: 16 },
  overview: { center: [-73.9525, 40.8235], zoom: 12.5 }
};
const params = new URLSearchParams(location.search);
let view = Object.hasOwn(views, params.get('view')) ? params.get('view') : 'morningside';
const camera = { ...views[view] };
const requestedZoom = Number(params.get('zoom'));
if (params.has('zoom') && Number.isFinite(requestedZoom)) {
  camera.zoom = Math.max(2, Math.min(20, requestedZoom));
}
const status = document.querySelector('#status');
const saveImage = document.querySelector('#save-image');
let map;
let resourceError = false;

function setActiveView() {
  document.querySelectorAll('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
}

setActiveView();
saveImage.disabled = true;

try {
  map = new maplibregl.Map({
    container: 'map',
    style: './style.json',
    ...camera,
    pitch: 0,
    bearing: 0,
    attributionControl: { compact: false },
    canvasContextAttributes: { preserveDrawingBuffer: true },
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
  map.on('error', () => {
    resourceError = true;
    status.textContent = 'Some map details could not load. Reload to try again.';
  });
  map.on('idle', () => {
    if (!resourceError) status.textContent = '';
    saveImage.disabled = !map.areTilesLoaded();
  });
  map.on('movestart', () => { saveImage.disabled = true; });
} catch {
  status.textContent = 'This browser could not display the map. Try a browser with WebGL enabled.';
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    if (!map) return;
    view = button.dataset.view;
    status.textContent = 'Loading map…';
    resourceError = false;
    const url = new URL(location.href);
    url.searchParams.set('view', view);
    url.searchParams.delete('zoom');
    history.replaceState(null, '', url);
    map.jumpTo({ ...views[view], pitch: 0, bearing: 0 });
    setActiveView();
  });
});

saveImage.addEventListener('click', () => {
  if (!map?.areTilesLoaded()) {
    status.textContent = 'Wait for the map to finish loading.';
    return;
  }
  const original = map.getCanvas();
  const canvas = document.createElement('canvas');
  canvas.width = original.width;
  canvas.height = original.height;
  const context = canvas.getContext('2d');
  context.drawImage(original, 0, 0);
  const scale = original.width / original.clientWidth;
  const font = 11 * scale;
  const pad = 10 * scale;
  const attribution = 'OpenFreeMap · © OpenMapTiles · © OpenStreetMap contributors';
  context.font = `${font}px Arial`;
  const lines = context.measureText(attribution).width + pad * 2 <= canvas.width
    ? [attribution]
    : ['OpenFreeMap · © OpenMapTiles', '© OpenStreetMap contributors'];
  const lineHeight = font * 1.4;
  const width = Math.max(...lines.map(line => context.measureText(line).width));
  context.fillStyle = 'rgba(255,255,255,0.94)';
  context.fillRect(canvas.width - width - pad * 2, canvas.height - lineHeight * lines.length - pad, width + pad * 2, lineHeight * lines.length + pad);
  context.fillStyle = '#354C5F';
  context.textAlign = 'right';
  lines.forEach((line, index) => {
    context.fillText(line, canvas.width - pad, canvas.height - pad * .65 - (lines.length - 1 - index) * lineHeight);
  });
  canvas.toBlob(blob => {
    if (!blob) {
      status.textContent = 'The image could not be saved. Please try again.';
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `columbia-blue-${view}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }, 'image/png');
});
