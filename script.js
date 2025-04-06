// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission
const contactForm = document.querySelector('form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// 3D Coffee Cup Model
let scene, camera, renderer, coffeeCup, controls;
const container = document.getElementById('coffee-cup-container');
const canvas = document.getElementById('coffee-cup-canvas');
const loadingIndicator = document.querySelector('.loading-indicator');

// Initialize Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = null;

    // Create camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    // Load the GLTF model
    loadCoffeeCupModel();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

// Load the GLTF model
function loadCoffeeCupModel() {
    // Check if GLTFLoader is available
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('GLTFLoader not found. Make sure the script is properly loaded.');
        loadingIndicator.querySelector('div').textContent = 'Error: GLTFLoader not found';
        return;
    }
    
    const loader = new THREE.GLTFLoader();
    
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Log the model path for debugging
    const modelPath = 'coffee/scene.gltf';
    console.log('Loading model from:', modelPath);
    
    // Load the model
    loader.load(
        modelPath,
        (gltf) => {
            console.log('Model loaded successfully:', gltf);
            coffeeCup = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(coffeeCup);
            const center = box.getCenter(new THREE.Vector3());
            coffeeCup.position.sub(center);
            
            // Scale the model appropriately
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            coffeeCup.scale.set(scale, scale, scale);
            
            // Add the model to the scene
            scene.add(coffeeCup);
            
            // Hide loading indicator
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 500);
        },
        (xhr) => {
            // Loading progress
            const percent = (xhr.loaded / xhr.total) * 100;
            console.log('Loading progress:', percent + '%');
            loadingIndicator.querySelector('div').textContent = `Loading 3D Model... ${Math.round(percent)}%`;
        },
        (error) => {
            console.error('Error loading model:', error);
            loadingIndicator.querySelector('div').textContent = 'Error loading 3D model. Check console for details.';
            
            // Try to load a fallback model or create a simple one
            createFallbackModel();
        }
    );
}

// Create a fallback model if loading fails
function createFallbackModel() {
    console.log('Creating fallback model');
    
    // Create a simple coffee cup
    const cupGeometry = new THREE.CylinderGeometry(1, 0.8, 1.5, 32);
    const cupMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 100,
        specular: 0x444444
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    
    // Handle
    const handleGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
    const handle = new THREE.Mesh(handleGeometry, cupMaterial);
    handle.position.set(1, 0, 0);
    handle.rotation.z = Math.PI / 2;
    
    // Coffee
    const coffeeGeometry = new THREE.CylinderGeometry(0.9, 0.7, 1.2, 32);
    const coffeeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4A2C2A,
        shininess: 50,
        specular: 0x222222
    });
    const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffee.position.y = 0.15;
    
    // Group all parts
    coffeeCup = new THREE.Group();
    coffeeCup.add(cup);
    coffeeCup.add(handle);
    coffeeCup.add(coffee);
    
    scene.add(coffeeCup);
    
    // Hide loading indicator
    loadingIndicator.style.opacity = '0';
    setTimeout(() => {
        loadingIndicator.style.display = 'none';
    }, 500);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (coffeeCup) {
        coffeeCup.rotation.y += 0.005;
    }
    
    // Update controls
    if (controls) {
        controls.update();
    }

    renderer.render(scene, camera);
}

// Initialize when the page loads
window.addEventListener('load', () => {
    init();
});

// 3D Model Container Animation
const modelContainer = document.getElementById('coffee-cup-container');

// Add hover effect to pause animation
modelContainer.addEventListener('mouseenter', () => {
    modelContainer.style.animationPlayState = 'paused';
});

modelContainer.addEventListener('mouseleave', () => {
    modelContainer.style.animationPlayState = 'running';
}); 