// Короткие импорты — пути даёт import map в HTML
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ARRenderer {
  constructor(canvasId) {
    this.canvas   = document.getElementById(canvasId);
    this.scene    = new THREE.Scene();
    this.camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.model    = null;
    this.isActive = false;

    this.init();
  }

  init() {
    if (!this.canvas) return false;

    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.set(0, 1.5, 5);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const dir     = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 10, 7);
    this.scene.add(ambient, dir);

    return true;
  }

  async loadModel(modelPath) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          if (this.model) this.scene.remove(this.model);
          this.model = gltf.scene;
          this.scene.add(this.model);
          resolve(this.model);
        },
        undefined,
        (err) => {
          console.warn('Ошибка загрузки GLTF, ставлю куб-заглушку.', err);
          const geo = new THREE.BoxGeometry(1, 1, 1);
          const mat = new THREE.MeshStandardMaterial({ color: 0x00ff99 });
          this.model = new THREE.Mesh(geo, mat);
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
    if (this.isActive) return;
    this.isActive = true;
    this.animate();
  }

  stop() {
    this.isActive = false;
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

export function initARRenderer(canvasId) {
  try {
    return new ARRenderer(canvasId);
  } catch (e) {
    console.error('Ошибка инициализации ARRenderer:', e);
    return null;
  }
}

// (опционально) проброс в window — если где-то старый код ожидает глобальную функцию
if (typeof window !== 'undefined') {
  window.initARRenderer = initARRenderer;
}
