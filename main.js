import * as THREE from 'three';
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { seededRandom } from 'three/src/math/MathUtils';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 20;

const light = new THREE.DirectionalLight(0xffffff, 1);
const light0 = light.clone()
// light0.position.set(0, -1, -1)
light.position.set(0, -1, 0);
light.castShadow = true;
scene.add(light0);
scene.add(light);

const sphereGeometry = new THREE.SphereGeometry(5, 6, 100, 2.2, 5);
sphereGeometry.translate(0,0,0)

const material = new THREE.MeshNormalMaterial({
  flatShading: true,
  side: THREE.DoubleSide,
  shadowSide: THREE.DoubleSide,
  
});

const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.geometry.scale(-1, 1, 1);
scene.add(sphereMesh); 


  let time = 0.001;
  const noiseScale = 1.3;
  const noise4D = createNoise4D(); 
  const noise3D = createNoise3D(); 
  const noise2D = createNoise2D(); 
  const vertices = sphereGeometry.attributes.position.array;






  const heartVertices = [
    new THREE.Vector3(0, 0, 0), // point C
    new THREE.Vector3(0, 5, -1.5),
    new THREE.Vector3(5, 5, 0), // point A
    new THREE.Vector3(9, 9, 0),
    new THREE.Vector3(5, 9, 2),
    new THREE.Vector3(7, 13, 0),
    new THREE.Vector3(3, 13, 0),
    new THREE.Vector3(0, 11, 0),
    new THREE.Vector3(5, 9, -2),
    new THREE.Vector3(0, 8, -3),
    new THREE.Vector3(0, 8, 3),
    new THREE.Vector3(0, 5, 1.5), // point B
    new THREE.Vector3(-9, 9, 0),
    new THREE.Vector3(-5, 5, 0),
    new THREE.Vector3(-5, 9, -2),
    new THREE.Vector3(-5, 9, 2),
    new THREE.Vector3(-7, 13, 0),
    new THREE.Vector3(-3, 13, 0),
  ];
  const trianglesIndexes = [
  // face 1
    2,11,0, // This represents the 3 points A,B,C which compose the first triangle
    2,3,4,
    5,4,3,
    4,5,6,
    4,6,7,
    4,7,10,
    4,10,11,
    4,11,2,
    0,11,13,
    12,13,15,
    12,15,16,
    16,15,17,
    17,15,7,
    7,15,10,
    11,10,15,
    13,11,15,
  // face 2
    0,1,2,
    1,9,2,
    9,8,2,
    5,3,8,
    8,3,2,
    6,5,8,
    7,6,8,
    9,7,8,
    14,17,7,
    14,7,9,
    14,9,1,
    9,1,13,
    1,0,13,
    14,1,13,
    16,14,12,
    16,17,14,
    12,14,13
  ]


  const heartGeometry = new THREE.BufferGeometry();
  const heartMaterial = new THREE.MeshStandardMaterial({ 
    flatShading: true,
 
    side: THREE.DoubleSide,
  });

  let dancing = 0.01;

  const customMate = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x24BFE8) },
      cameraPosition: { value: new THREE.Vector3() },
      modelMatrix: { value: new THREE.Matrix4() }, 
      averageFrequency: { value: 0.0 },
    },
    vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float averageFrequency;

    void main() {
      vNormal = normal;
      vec3 pos = position.xyz;
      pos += sin(pos * averageFrequency) * 0.2;
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform mat4 modelMatrix;
      varying vec3 vNormal;
      varying vec3 vPosition;
  
      void main() {
        vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
        vec3 viewDirection = normalize(cameraPosition - (modelMatrix * vec4(vPosition, 1.0)).xyz); // Compute view direction using model matrix
        float light = dot(normal, viewDirection);
        gl_FragColor = vec4(color * 0.5 + 0.5 * light, 1.0);
      }
    `,
  });




  console.log(customMate);


  const normalMate = new THREE.MeshNormalMaterial({
    flatShading: true,
  })

 
  const hvertices = new Float32Array(heartVertices.length * 3);
    for (let i = 0; i < heartVertices.length; i++) {
      hvertices[i * 3] = heartVertices[i].x;
      hvertices[i * 3 + 1] = heartVertices[i].y;
      hvertices[i * 3 + 2] = heartVertices[i].z;
    }
  heartGeometry.setAttribute('position', new THREE.BufferAttribute(hvertices, 3));
  
  const indices = new Uint16Array(trianglesIndexes.length);
    for (let i = 0; i < trianglesIndexes.length; i++) {
      indices[i] = trianglesIndexes[i];
    }

  heartGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const hmesh = new THREE.Mesh(heartGeometry, customMate);

  heartGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(heartGeometry.attributes.position.array.length * 3), 3));
  heartGeometry.computeVertexNormals();

  for (let i = 0; i < heartGeometry.attributes.normal.array.length; i +=3) {

    const v1 = heartGeometry.index.array[i];
    const v2 = heartGeometry.index.array[i + 1];
    const v3 = heartGeometry.index.array[i + 2];

    heartGeometry.attributes.color.setXYZ(v1, 255,0.01,1.1);
    heartGeometry.attributes.color.setXYZ(v2, 255,0.001,0.5);
    heartGeometry.attributes.color.setXYZ(v3, 255,0.01,0.9);
    
  }


  hmesh.material.vertexColors = true;
  
  scene.add(hmesh);


  hmesh.scale.set(0.3,0.3,0.3)
  hmesh.position.set(0,-2,0)






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
  dancing = averageFrequency
  
  time+=0.01

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    const position = new THREE.Vector3(x, y, z).normalize();
    const noise = noise3D(position.x* noiseScale+time, position.y* noiseScale, position.z* noiseScale);
    position.multiplyScalar(6+0.7 * noise );
    position.toArray(vertices, i);
  }
 
  sphereGeometry.computeVertexNormals();
  sphereGeometry.attributes.normal.needsUpdate = true;
  sphereGeometry.attributes.position.needsUpdate = true;

  hmesh.geometry.attributes.normal.needsUpdate = true;

  // sphereGeometry.rotateY(-0.001);
  heartGeometry.rotateY(-0.01)
  customMate.uniforms.cameraPosition.value.copy(camera.position);
  customMate.uniforms.averageFrequency.value = averageFrequency;


  requestAnimationFrame(animate);
  renderer.render( scene, camera );
  controls.update();

  
}

animate()
});