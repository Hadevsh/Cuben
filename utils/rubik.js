// Create the 9 stickers for each of the 6 faces
document.querySelectorAll('.face').forEach(face => {
  for (let i = 0; i < 9; i++) {
    const sticker = document.createElement('div');
    sticker.classList.add('sticker');
    face.appendChild(sticker);
  }
});

// Set up variables for dragging rotation
const cube = document.getElementById('cube');
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
// Start with an initial rotation
let rotation = { x: -30, y: 45 };

// Update the cube's CSS transform based on rotation values
function updateCubeRotation() {
  cube.style.transform = 'rotateX(' + rotation.x + 'deg) rotateY(' + rotation.y + 'deg)';
}

// Mouse events for desktop
document.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
  cube.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;
  rotation.y += deltaX * 0.5;
  rotation.x -= deltaY * 0.5;
  updateCubeRotation();
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  cube.style.transition = 'transform 0.5s';
});

// Touch events for mobile devices
document.addEventListener('touchstart', (e) => {
  isDragging = true;
  const touch = e.touches[0];
  previousMousePosition = { x: touch.clientX, y: touch.clientY };
  cube.style.transition = 'none';
});

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - previousMousePosition.x;
  const deltaY = touch.clientY - previousMousePosition.y;
  rotation.y += deltaX * 0.5;
  rotation.x -= deltaY * 0.5;
  updateCubeRotation();
  previousMousePosition = { x: touch.clientX, y: touch.clientY };
});

document.addEventListener('touchend', () => {
  isDragging = false;
  cube.style.transition = 'transform 0.5s';
});