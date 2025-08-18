const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bg-canvas').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const particleCount = 700;
const positions = [];

for (let i = 0; i < particleCount; i++) {
  positions.push((Math.random() - 0.5) * 100); // x
  positions.push((Math.random() - 0.5) * 100); // y
  positions.push((Math.random() - 0.5) * 100); // z
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));

const material = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.4, transparent:true, opacity:0.8 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 50;

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.002;
  particles.rotation.x += 0.001;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
