import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

let object;
let firstModel;
let isShaking = false;
let isDetecting = true;

const calcDeg = (deg) => deg * (Math.PI / 280);

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

            object.scale.set(0.45, 0.45, 0.45);

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

function loadNewModel(modelUrl, maze) {
    loader.load(
        modelUrl,
        function (gltf) {
            scene.remove(object);

            object = gltf.scene.children[0];

            object.material = new THREE.MeshStandardMaterial({
                color: 0xFADC91
            });

            if (maze === 'originMaze') {
                object.scale.set(0.45, 0.45, 0.45);
            } else if (maze === 'newMaze') {
                object.scale.set(0.35, 0.35, 0.35);
            }

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

window.addEventListener('deviceorientation', (event) => {
    rotateMaze(event);
});

function rotateMaze(event) {
    scene.rotation.z = calcDeg(event.alpha) / 2;
    scene.rotation.x = calcDeg(event.beta);
    scene.rotation.y = calcDeg(event.gamma);

    renderer.render(scene, camera);
}
rotateMaze();

window.addEventListener('devicemotion', detectShake);

function detectShake(event) {
    if (isDetecting && (event.acceleration.x > 20 || event.acceleration.y > 20 || event.acceleration.z > 20)) {
        isDetecting = false;
        window.removeEventListener('devicemotion', detectShake);
        if (!isShaking) {
            loadNewModel('/maze.gltf', 'newMaze');
        } else {
            loadNewModel('/the_maze.gltf', 'originMaze');
        }
        isShaking = !isShaking;
        setTimeout(() => {
            isDetecting = true;
            window.addEventListener('devicemotion', detectShake);
        }, 2000);
    }
}