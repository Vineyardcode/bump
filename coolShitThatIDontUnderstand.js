// let t = 0; 
// const noise4D = createNoise4D();

// const vertices = sphereGeometry.attributes.position.array;
// function mapNoiseToHeight(x, y, z, t) {
//   const noiseValue = noise4D(x, y, z, t);
//   return noiseValue * 2; 
// }


//   t += 0.0001;

//   for (let i = 0; i < vertices.length; i += 15) {
//     const x = vertices[i];
//     const y = vertices[i + 1];
//     const z = vertices[i + 2];
  
//     const height = mapNoiseToHeight(x, y, z, t);
  
//     vertices[i + 1] = height*0.1;
//   }
  
//   sphereGeometry.attributes.position.needsUpdate = true;
//   sphereGeometry.rotateY(0.001)






  // const noise4D = createNoise4D(); 
  // const noise3D = createNoise3D(); 
  // const noise2D = createNoise2D(); 
  // const vertices = sphereGeometry.attributes.position.array;
  
  


  // sphereGeometry.computeVertexNormals();

  // const noiseScale = 0.08 + Math.random() * 0.02;
  // const time = Date.now() * 0.0005 + Math.random() * 0.1;

  // const center = new THREE.Vector3(0, 0, 0); 

  
  // for (let i = 0; i < vertices.length; i += 3 ) {
  //   const x = vertices[i];
  //   const y = vertices[i + 1];
  //   const z = vertices[i + 2];
  //   const vertex = new THREE.Vector3(x, y, z);
  
  //   const distance = vertex.distanceTo(center);
  //   const direction = (vertex.sub(center)).normalize();
    
  //   const noiseValue = noise4D(
  //     direction.x * noiseScale*x + distance,
  //     direction.y * noiseScale*y + distance,
  //     direction.z * noiseScale*z + distance,
  //     time
     
  //   )* (1 + Math.random() * 0.5);
  
  //   sphereGeometry.attributes.normal.setXYZ(i / 3, direction.x, direction.y, direction.z);
  //   const scaleFactor = 0.01;
  //   const noiseOffset = noiseValue * scaleFactor;
    
  //   sphereGeometry.attributes.position.setXYZ(
  //     i / 3,
  //     x + direction.x * noiseOffset,
  //     y + direction.y * noiseOffset,
  //     z + direction.z * noiseOffset
  //   );
  // }
  
  // sphereGeometry.attributes.normal.needsUpdate = true;
  // sphereGeometry.attributes.position.needsUpdate = true;


  const customMateriala = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x0f0ff0) }
    },
  
    vertexShader: `
      varying vec3 vNormal;
  
      void main() {
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  
    fragmentShader: `
      uniform vec3 color;
      varying vec3 vNormal;
  
      void main() {
        vec3 normal = normalize(cross(dFdx(vNormal), dFdy(vNormal)));
        gl_FragColor = vec4(color * 0.5 + 0.5 * abs(normal), 1.0);
      }
    `,
  });





