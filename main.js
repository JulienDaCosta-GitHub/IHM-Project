// import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//
// // Crée une nouvelle scène Three.js
// const scene = new THREE.Scene();
//
// // Crée une caméra pour visualiser la scène
// const camera = new THREE.PerspectiveCamera(
//     75, // Champ de vision
//     window.innerWidth / window.innerHeight, // Ratio d'aspect
//     0.1, // Distance minimale de rendu
//     1000 // Distance maximale de rendu
// );
//
// // Crée un moteur de rendu Three.js
// const renderer = new THREE.WebGLRenderer();
//
// // Définit la taille de la zone de rendu
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor( 0xffffff )
//
// // Ajoute la zone de rendu au document
// document.body.appendChild(renderer.domElement);
//
// // Définit la position de la caméra
// camera.position.z = 100;
//
// // Charge le modèle GLTF en utilisant GLTFLoader
// const loader = new GLTFLoader();
// loader.load(
//     '/the_maze.gltf',
//     function (gltf) {
//
//         // Récupère l'objet principal de la scène du modèle GLTF
//         const object = gltf.scene.children[0];
//
//         // Récupère le matériau de l'objet
//         const material = object.material;
//
//         // Modifie la couleur du matériau
//         material.color.set('#ff0000'); // Par exemple, rouge
//
//         // Redimensionne l'objet
//         object.scale.set(0.5, 0.5, 0.5); // Par exemple, divise la taille par 2
//
//         // Ajoute l'objet à la scène
//         scene.add(object);
//     },
//     function (xhr) {
//         // Fonction de progression
//         console.log((xhr.loaded / xhr.total * 100) + '% chargé');
//     },
//     function (error) {
//         // Fonction d'erreur
//         console.error('Erreur de chargement', error);
//     }
// );
//
// // Fonction d'animation
// function animate() {
//     requestAnimationFrame(animate);
//
//     // // Fait tourner le modèle sur son axe Y
//     // if (scene.children.length > 0) {
//     //     scene.children[0].rotation.y += 0.01;
//     // }
//
//     renderer.render(scene, camera);
// }
// animate();

import * as THREE from 'three';

let alpha, beta, gamma = 0;

window.addEventListener('deviceorientation', (event) => {
    alpha = event.alpha;
    beta = event.beta;
    gamma = event.gamma;
});

const degToRad = (deg) =>  deg * (Math.PI / 180);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);



const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {

    cube.rotation.z = degToRad(alpha) / 2;
    cube.rotation.x = degToRad(beta);
    cube.rotation.y = degToRad(gamma);

    renderer.render(scene, camera);
}

animate(); 