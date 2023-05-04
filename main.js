import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let alpha, beta, gamma = 0;

window.addEventListener('deviceorientation', (event) => {
    alpha = event.alpha;
    beta = event.beta;
    gamma = event.gamma;
});

const degToRad = (deg) =>  deg * (Math.PI / 180);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00
// });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 100;

// Charge le modèle GLTF en utilisant GLTFLoader
const loader = new GLTFLoader();
loader.load(
    '/the_maze.gltf',
    function (gltf) {

        // Récupère l'objet principal de la scène du modèle GLTF
        const object = gltf.scene.children[0];

        // Récupère le matériau de l'objet
        const material = object.material;

        // Modifie la couleur du matériau
        material.color.set('#ff0000'); // Par exemple, rouge

        // Redimensionne l'objet
        object.scale.set(0.5, 0.5, 0.5); // Par exemple, divise la taille par 2

        // Ajoute l'objet à la scène
        scene.add(object);
    },
    function (xhr) {
        // Fonction de progression
        console.log((xhr.loaded / xhr.total * 100) + '% chargé');
    },
    function (error) {
        // Fonction d'erreur
        console.error('Erreur de chargement', error);
    }
);

function animate() {

    scene.rotation.z = degToRad(alpha) / 2;
    scene.rotation.x = degToRad(beta);
    scene.rotation.y = degToRad(gamma);

    renderer.render(scene, camera);
}

animate();