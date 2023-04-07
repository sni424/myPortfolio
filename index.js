import THREE from "three.js";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosVertexShader from "./shaders/atmosVertex.glsl";
import atmosFragmentShader from "./shaders/atmosFragment.glsl";
export default function example() {
    const canvas = document.querySelector("#three-canvas");
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    const canvasContainer = document.querySelector("#canvasContainer");
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
        45,
        canvasContainer.offsetWidth / canvasContainer.offsetHeight,
        0.1,
        1000
    );

    camera.position.z = 25;

    // CONTROLS
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target = new THREE.Vector3(0, 0, 0);
    // controls.update();

    // AMBIENT LIGHT
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    // DIRECTIONAL LIGHT
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);

    let target = new THREE.Object3D();
    target.position.z = -20;
    dirLight.target = target;
    dirLight.target.updateMatrixWorld();

    scene.add(dirLight);

    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const newMap = textureLoader.load("./image/earth_texture.jpg");

    //구체생성
    const sphereGeo = new THREE.SphereGeometry(5, 50, 50);
    const sphereMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            globeTexture: {
                value: newMap,
            },
        },
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(5, 50, 50),
        new THREE.ShaderMaterial({
            vertexShader: atmosVertexShader,
            fragmentShader: atmosFragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            fog: true,
        })
    );

    atmosphere.scale.set(1.1, 1.1, 1.1);
    scene.add(atmosphere);

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = -Math.random() * 3000;
        starVertices.push(x, y, z);
    }

    starGeometry.addAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(starVertices), 3)
    );

    const stars = new THREE.Points(starGeometry, starMaterial);
    // Define the "scene" variable or use an existing reference to your THREE.js scene
    scene.add(stars);
    // ANIMATE
    // document.body.appendChild(renderer.domElement);

    // RESIZE HANDLER
    function onWindowResize() {
        (camera.aspect =
            canvasContainer.offsetWidth / canvasContainer.offsetHeight),
            camera.updateProjectionMatrix();
        renderer.setSize(
            canvasContainer.offsetWidth,
            canvasContainer.offsetHeight
        );
    }
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    });

    const group = new THREE.Group();
    group.add(sphereMesh, atmosphere);
    scene.add(group);

    const mouse = {
        x: undefined,
        y: undefined,
    };

    function animate() {
        // SINE WAVE
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        sphereMesh.rotation.y += 0.005;
        gsap.to(group.rotation, {
            x: -mouse.y * 0.8,
            y: mouse.x * 0.8,
            duration: 1.5,
        });
        // group.rotation.x = -mouse.y;
    }
    animate();
}
