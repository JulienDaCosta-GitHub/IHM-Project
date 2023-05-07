import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

let alpha, beta, gamma = 0;
let object;
let firstModel;

window.addEventListener('deviceorientation', (event) => {
    alpha = event.alpha;
    beta = event.beta;
    gamma = event.gamma;
});

const calcDeg = (deg) =>  deg * (Math.PI / 280);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x425EAD);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(rotateMaze);
document.body.appendChild(renderer.domElement);

camera.position.z = 100;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const loader = new GLTFLoader();

function originLoad() {
    loader.load(
        '/the_maze.gltf',
        function (gltf) {

            firstModel = true;

            object = gltf.scene.children[0];

            object.material = new THREE.MeshStandardMaterial({
                color: 0xFADC91
            });

            object.scale.set(0.4, 0.4, 0.4);

            object.rotation.x = -0.99;
            object.rotation.y = 0.5;
            object.rotation.z = -0.5;

            scene.add(object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% chargé');
        },
        function (error) {
            console.error('Erreur de chargement', error);
        }
    );
}
originLoad();

function loadNewModel(modelUrl) {
    loader.load(
        modelUrl,
        function (gltf) {
            scene.remove(object);

            object = gltf.scene.children[0];

            object.material = new THREE.MeshStandardMaterial({
                color: 0xFADC91
            });

            object.scale.set(0.5, 0.5, 0.5);

            object.rotation.x = -0.99;
            object.rotation.y = 0.5;
            object.rotation.z = -0.25;

            scene.add(object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% chargé');
        },
        function (error) {
            console.error('Erreur de chargement', error);
        }
    );
}

let isShaking = false;
let isDetecting = true;

window.addEventListener('devicemotion', detectShake);

function detectShake(event) {
    if (isDetecting && (event.acceleration.x > 20 || event.acceleration.y > 20 || event.acceleration.z > 20)) {
        isDetecting = false;
        window.removeEventListener('devicemotion', detectShake);
        if (!isShaking) {
            loadNewModel('/maze.gltf');
        } else {
            loadNewModel('/the_maze.gltf');
        }
        isShaking = !isShaking;
        setTimeout(() => {
            isDetecting = true;
            window.addEventListener('devicemotion', detectShake);
        }, 2000);
    }
}

function rotateMaze() {
    scene.rotation.z = calcDeg(alpha) / 2;
    scene.rotation.x = calcDeg(beta);
    scene.rotation.y = calcDeg(gamma);

    renderer.render(scene, camera);
}

rotateMaze();