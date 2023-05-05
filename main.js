import * as THREE from 'three';
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'


  //--------------------------- SCENE, CAMERA, LIGHT ---------------------------//

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 20;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  const light0 = light.clone()

  const ambientLight = new THREE.AmbientLight(0xaaaaaa)


  // light0.position.set(0, -1, -1)
  light.position.set(0, -1, 0);
  light.castShadow = true;
  scene.add(light0);
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
  const noise4D = createNoise4D(); 
  const noise3D = createNoise3D(); 
  const noise2D = createNoise2D(); 
  const vertices = sphereGeometry.attributes.position.array;

  //--------------------------- HEART ---------------------------// 

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



      //--------------------------- CUBE CAMERA ---------------------------//



        const heartBoundingBox = new THREE.Box3().setFromPoints(heartGeometry.attributes.position.array);
        const heartSize = heartBoundingBox.getSize(new THREE.Vector3());
        const cubeRenderTargetSize = Math.max(heartSize.x, heartSize.y, heartSize.z) * 2;

        let cubeCamera, cubeRenderTarget;

				cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1000,  {

          generateMipmaps: true,
          minFilter: THREE.LinearMipMapLinearFilter
        });
				// cubeRenderTarget.texture.type = THREE.HalfFloatType;
        
				cubeCamera = new THREE.CubeCamera( 1, 7, cubeRenderTarget );

        scene.add(cubeCamera);
        
        const material1 = new THREE.MeshPhongMaterial( {
					envMap: cubeRenderTarget.texture,
					roughness: 0.005,
					metalness: 1,
          side: THREE.DoubleSide,
          flatShading: true
				} );

        const fuckingBallGeometry0 = new THREE.IcosahedronGeometry(3.2, 1);
        const fuckingBallGeometry1 = new THREE.IcosahedronGeometry(0.5, 1);



        const boxMesh0 = new THREE.Mesh(fuckingBallGeometry0, material1);
        const fuckingBallMesh = new THREE.Mesh(fuckingBallGeometry1, material);
        
        // scene.add(fuckingBallMesh)
        scene.add(boxMesh0); 

        console.log(cubeRenderTarget);

        const boxGeometry = new THREE.BoxGeometry(200, 200, 200);
        boxGeometry.translate(0,0,0)
      
      
        const boxMesh = new THREE.Mesh(boxGeometry, material);
        
      
        scene.add(boxMesh); 

  const customMate = new THREE.ShaderMaterial({

    uniforms: {
      color: { value: new THREE.Color(0x24BFE8) },
      cameraPosition: { value: new THREE.Vector3() },
      modelMatrix: { value: new THREE.Matrix4() }, 
      bpm: { value: 0.0 },
      rightNow: { value: Date.now() },
      envMap: { value: cubeRenderTarget.texture },


    },

    vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float bpm;
    uniform float rightNow;

    void main() {
      vNormal = normal;
      vec3 pos = position.xyz;

      pos += fract(bpm * ((rightNow*0.001)/60.));

      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,

    fragmentShader: `
      uniform vec3 color;
      uniform mat4 modelMatrix;
      uniform samplerCube envMap;

      varying vec3 vNormal;
      varying vec3 vPosition;
      


      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(cameraPosition - (modelMatrix * vec4(vPosition, 1.0)).xyz);
        vec3 reflectionDirection = reflect(viewDirection, normal);
        vec4 reflectedColor = textureCube(envMap, reflectionDirection);
      
        float light = max(dot(normal, viewDirection),0.);
      
        gl_FragColor = vec4(reflectedColor.rgb * 0.5 + 0.5 * light, 1.0);
      }
      
      
    `,

  });

  const hmesh = new THREE.Mesh(heartGeometry, material1);

  // scene.add(hmesh);

  hmesh.scale.set(0.3,0.3,0.3)
  hmesh.position.set(0,-2,0)
  hmesh.castShadow = true
  hmesh.receiveShadow = true
  hmesh.add(cubeCamera)
  hmesh.geometry.computeBoundingBox();
  
  //--------------------------- AUDIO & ANIMATION ---------------------------//

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

  analyser.getByteTimeDomainData(dataArray);
 
  time+=0.01
  
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    const position = new THREE.Vector3(x, y, z).normalize();
    const noise = noise3D(position.x* noiseScale+time, position.y* noiseScale, position.z* noiseScale);
    position.multiplyScalar(6+0.7 * noise );
    position.toArray(vertices, i);
    
  // customMate.uniforms.bpm.value = noise;
  }

  heartBoundingBox.copy( hmesh.geometry.boundingBox ).applyMatrix4( hmesh.matrixWorld );

 
  sphereGeometry.computeVertexNormals();
  sphereGeometry.attributes.normal.needsUpdate = true;
  sphereGeometry.attributes.position.needsUpdate = true;


  cubeCamera.position.copy( hmesh.position );

  cubeCamera.update( renderer, scene );

  // sphereGeometry.rotateY(-0.001);
  boxMesh0.rotateX(0.003)
  boxMesh0.rotateY(0.01)
  boxMesh0.rotateZ(0.001)

  fuckingBallMesh.position.x = Math.cos( time + 0.1 ) * 3.9;
  // fuckingBallMesh.position.y = Math.sin( time + 0.1 ) * 3.7;
  fuckingBallMesh.position.z = Math.sin( time + 0.1 ) * 3.9;

  heartGeometry.rotateY(-0.01)
  customMate.uniforms.cameraPosition.value.copy(camera.position);
  
  customMate.uniforms.rightNow.value = Date.now();
  controls.update();


  renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

animate()
});