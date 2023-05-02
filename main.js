import * as THREE from 'three';
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { seededRandom } from 'three/src/math/MathUtils';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 20;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
light.castShadow = true;
scene.add(light);

const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
sphereGeometry.translate(0,0,0)
const material = new THREE.MeshNormalMaterial({
  flatShading: true,
  side: THREE.DoubleSide,
  shadowSide: THREE.DoubleSide
});

const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.geometry.scale(-1, 1, 1);
scene.add(sphereMesh); 


  let time = 0.01;
  const noiseScale = 5;
  const noise4D = createNoise4D(); 
  const noise3D = createNoise3D(); 
  const noise2D = createNoise2D(); 
  const vertices = sphereGeometry.attributes.position.array;










let isAudioContextStarted = false;

function startAudioContext() {
  if (!isAudioContextStarted) {
    isAudioContextStarted = true;
    audioContext.resume().then(() => {
      console.log('AudioContext started');
    });
  }
}

document.addEventListener('click', startAudioContext);
document.addEventListener('touchstart', startAudioContext);

const audioContext = new AudioContext();

navigator.mediaDevices.getUserMedia({audio: {deviceId: 'VBAudioVACWDM'}})
  .then(stream => {
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 1024;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
  
 



function animate() {

  let dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);
 
  const averageFrequency = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

  const maxFrequency = Math.max(...dataArray);
  const maxIndex = dataArray.indexOf(maxFrequency);

  const midStart = Math.floor(bufferLength / 10 * 3);
  const midEnd = Math.floor(bufferLength / 10 * 7);
  const midRange = dataArray.slice(midStart, midEnd);

  const averageMidTone = midRange.reduce((acc, val) => acc + val, 0) / midRange.length;

  // console.log("Average frequency:", averageFrequency);
  // console.log("Maximum frequency:", maxFrequency, "at index", maxIndex);
  // console.log("Average midtone frequency:", averageMidTone);

  
time+=0.01

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    const position = new THREE.Vector3(x, y, z).normalize();
    const noise = noise3D(position.x* noiseScale+time, position.y* noiseScale, position.z* noiseScale);
    position.multiplyScalar(5+0.7 * noise );
    position.toArray(vertices, i);
  }
 
  sphereGeometry.computeVertexNormals();
  sphereGeometry.attributes.normal.needsUpdate = true;
  sphereGeometry.attributes.position.needsUpdate = true;
  sphereGeometry.rotateY(0.001);

  requestAnimationFrame(animate);
  renderer.render( scene, camera );
  controls.update();

  
}

animate()
});