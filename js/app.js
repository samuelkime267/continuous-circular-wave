import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor("black", 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    // this.mouseEvents();
    this.resize();
    this.render();
    this.setupResize();
    this.settings();
  }

  settings() {
    let that = this;
    this.settings = {
      waves: 50,
      speed: 0.5,
      amplitude: 0.05,
      fade: 0.3,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "waves", 1, 150, 1).onChange((val) => {
      this.material.uniforms.uWaves.value = val;
    });
    this.gui.add(this.settings, "speed", 0, 5, 0.01).onChange((val) => {
      this.material.uniforms.uSpeed.value = val;
    });
    this.gui.add(this.settings, "amplitude", 0.01, 2, 0.001).onChange((val) => {
      this.material.uniforms.uAmplitude.value = val;
    });
    this.gui.add(this.settings, "fade", 0.001, 1, 0.001).onChange((val) => {
      this.material.uniforms.uFade.value = val;
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  mouseEvents() {
    window.addEventListener("mousemove", (e) => {
      this.pointer.x = (e.clientX / this.width) * 2 - 1;
      this.pointer.y = -(e.clientY / this.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects([this.plane]);
      if (intersects.length > 0) {
        const { x, y, z } = intersects[0].point;
        this.pointer.set(x, y);
        // console.log({ x, y, z });
        this.material.uniforms.mousePos.value = intersects[0].point;
      }
    });
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uWaves: { value: 50 },
        uSpeed: { value: 0.5 },
        uAmplitude: { value: 0.05 },
        uFade: { value: 0.3 },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 256, 256);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.rotation.set(-Math.PI * 0.3, Math.PI * 0.15, 0);
    this.scene.add(this.plane);
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.uTime.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});
