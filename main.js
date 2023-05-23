import * as THREE from 'three';
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



//--------------------------- SCENE, CAMERA, LIGHT ---------------------------//

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 20;

  const light = new THREE.DirectionalLight(0xffffff, 1);

  const ambientLight = new THREE.AmbientLight(0xffffff)

  light.position.set(0, -1, 0);
  light.castShadow = true;

  scene.add(light);
  scene.add(ambientLight)

//--------------------------- SPHERE ---------------------------// 

  const sphereGeometry = new THREE.SphereGeometry(10, 5, 100, 2.2, 5);
  sphereGeometry.translate(0,0,0)

  const material = new THREE.MeshNormalMaterial({
    flatShading: true,
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
    
  });

  const sphereMesh = new THREE.Mesh(sphereGeometry, material);
  sphereMesh.geometry.scale(1, 1, 1);
  scene.add(sphereMesh); 

  let time = 0.001;
  const noiseScale = 1.3;

  const noise3D = createNoise3D(); 

  const vertices = sphereGeometry.attributes.position.array;

//--------------------------- CUBE CAMERA ---------------------------//

  let cubeCamera, cubeRenderTarget;

  cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1000,  {

    generateMipmaps: true,
    minFilter: THREE.LinearMipMapLinearFilter
  });
  // cubeRenderTarget.texture.type = THREE.HalfFloatType;

  cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

  scene.add(cubeCamera);

//--------------------------- HEART & BOX ---------------------------// 

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

  const heartGeometry = new THREE.BufferGeometry(); // put either heart or ball to the hmesh

  const sphereG = new THREE.IcosahedronGeometry(5,1)

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

  const material1 = new THREE.MeshPhongMaterial( {
    envMap: cubeRenderTarget.texture,
    side: THREE.DoubleSide,
    flatShading: true
  } );

  const boxGeometry = new THREE.BoxGeometry(200, 200, 200);
  boxGeometry.translate(0,0,0)

  const boxMesh = new THREE.Mesh(boxGeometry, material);
  boxMesh.rotateY(70)

  const hmesh = new THREE.Mesh(sphereG, material1);

  scene.add(boxMesh); 
  scene.add(hmesh);

  hmesh.scale.set(0.59,0.59,0.59)
  hmesh.position.set(0,0,0)
  hmesh.castShadow = true
  hmesh.receiveShadow = true
  hmesh.add(cubeCamera)
  hmesh.geometry.computeBoundingBox();

//--------------------------- ANIMATION ---------------------------//

  function animate() {

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

    hmesh.rotateY(-0.005)
    hmesh.rotateX(-0.005)

    cubeCamera.position.copy( hmesh.position );

    cubeCamera.update( renderer, scene );

    

    controls.update();


    renderer.render( scene, camera );
    requestAnimationFrame(animate);

    }

  animate()

  //--------------------------- DISPLAY THE PAGE IN AN IFRAME IN MY PORTFOLIO ---------------------------//

  window.addEventListener("message", receiveMessage);

  function receiveMessage(event) {

    if (event.origin === "https://vineyard-kappa.vercel.app/") {
      // The message was sent from the portfolio page
      console.log(event.data);

      event.source.postMessage("Sup ?", event.origin);
    } else {
      return;
    }
  }