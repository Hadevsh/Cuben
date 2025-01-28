const cube = document.getElementById('cube');
const scene = document.getElementById('scene');

let isDragging = false;
let startX, startY;
let rotationX = -30;
let rotationY = -30;

scene.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

scene.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  rotationY += deltaX * 0.5;
  rotationX -= deltaY * 0.5;
  cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  startX = e.clientX;
  startY = e.clientY;
});

scene.addEventListener('mouseup', () => {
  isDragging = false;
});

scene.addEventListener('mouseleave', () => {
  isDragging = false;
});