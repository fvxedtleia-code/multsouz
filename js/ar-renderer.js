class ARRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        this.model = null;
        this.isActive = false;
    }

    init() {
        if (!this.canvas) return false;
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.set(0, 1.5, 5);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(ambientLight, directionalLight);
        
        return true;
    }

    async loadModel(modelPath) {
        return new Promise((resolve) => {
            const loader = new GLTFLoader();
            loader.load(modelPath,
                (gltf) => {
                    this.model = gltf.scene;
                    this.scene.add(this.model);
                    resolve(this.model);
                },
                null,
                () => {
                   
                    const geometry = new THREE.BoxGeometry(1, 1, 1);
                    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                    this.model = new THREE.Mesh(geometry, material);
                    this.scene.add(this.model);
                    resolve(this.model);
                }
            );
        });
    }

    setModelPosition(x, y, z) {
        if (this.model) this.model.position.set(x, y, z);
    }

    setModelScale(scale) {
        if (this.model) this.model.scale.set(scale, scale, scale);
    }

    start() {
        this.isActive = true;
        this.animate();
    }

    animate() {
        if (!this.isActive) return;
        requestAnimationFrame(() => this.animate());
        if (this.model) this.model.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.initARRenderer = function(canvasId) {
    const ar = new ARRenderer(canvasId);
    return ar.init() ? ar : null;
};