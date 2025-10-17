// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- NUCLEUS ---
const nucleus = new THREE.Group();
const protonMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.3, roughness: 0.4 });
const neutronMaterial = new THREE.MeshStandardMaterial({ color: 0xadd8e6, metalness: 0.3, roughness: 0.4 });
const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);

function createParticles(count, material) {
    for (let i = 0; i < count; i++) {
        const particle = new THREE.Mesh(particleGeometry, material);
        setRandomPositionInSphere(particle, 1.0); // Keep them tightly packed
        nucleus.add(particle);
    }
}

createParticles(92, protonMaterial); // Protons
createParticles(146, neutronMaterial); // Neutrons
scene.add(nucleus);

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);


// --- ELECTRON CLOUD ---
const cloudGeometry = new THREE.SphereGeometry(4, 64, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Orange
    transparent: true,
    opacity: 0.1,
    metalness: 0.1,
    roughness: 0.8,
});
const electronCloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(electronCloud);

// --- ELECTRONS ---
const electrons = [];
const electronMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Orange
    emissive: 0xffa500,
    emissiveIntensity: 2,
});

for (let i = 0; i < 10; i++) {
    const electron = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), electronMaterial);
    setRandomPositionInSphere(electron, 4);
    electrons.push(electron);
    scene.add(electron);
}

/**
 * Sets a random position for an object within a sphere of a given radius.
 * @param {THREE.Object3D} object - The object to position.
 * @param {number} radius - The radius of the sphere.
 */
function setRandomPositionInSphere(object, radius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * radius;

    object.position.x = r * Math.sin(phi) * Math.cos(theta);
    object.position.y = r * Math.sin(phi) * Math.sin(theta);
    object.position.z = r * Math.cos(phi);
}


// --- ANIMATION ---
const clock = new THREE.Clock();
const rotationSpeed = (2 * Math.PI) / 10; // Revolutions per second to radians per second

let lastElectronUpdate = 0;

// Create a group to hold all parts of the atom for unified rotation
const atom = new THREE.Group();
atom.add(nucleus);
atom.add(electronCloud);
electrons.forEach(e => atom.add(e));
scene.add(atom);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate the entire atom
    atom.rotation.y = rotationSpeed * elapsedTime;
    atom.rotation.x = rotationSpeed * elapsedTime * 0.5; // Add some x-axis tilt

    // Update electron positions
    if (elapsedTime - lastElectronUpdate > 0.1) { // 100ms
        electrons.forEach(electron => {
            setRandomPositionInSphere(electron, 4);
        });
        lastElectronUpdate = elapsedTime;
    }

    renderer.render(scene, camera);
}

animate();