import './App.css';
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
// import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import create from 'zustand'
import { lerp } from 'three/src/math/MathUtils';
// import { useSpring } from '@react-spring/three'


const useStore = create((set) => ({
  x: 0,
  y: 0,
  z: 0,
  lookAtX: 0,
  lookAtY: 0,
  lookAtZ: 0,
  wait: false,
  changeLookAT: (position) => set(() => ({ x: position.x, y: position.y, z: position.z })),
  center: () => set({ x: 0, y: 0, z: 0 }),
}))

const CameraMove = () => {

  const state = useStore((state) => state)

  const { camera } = useThree()
  const vec = new THREE.Vector3()
  const vecLookAt = new THREE.Vector3()

  let prevLookAt = {
    x: state.lookAtX,
    y: state.lookAtY,
    z: state.lookAtZ
  }


  useFrame(({clock}) => {

    const elapsedTime = clock.getElapsedTime();

    const newLookAt = {
      x: lerp( (prevLookAt.x), state.lookAtX, (elapsedTime % 3) / 3 ),
      y: lerp( (prevLookAt.y), state.lookAtY, (elapsedTime % 3) / 3 ),
      z: lerp( (prevLookAt.z), state.lookAtZ, (elapsedTime % 3) / 3 )
    }

    if(newLookAt.x >= state.lookAtX - 0.01 && newLookAt.y >= state.lookAtY - 0.01 && newLookAt.z >= state.lookAtZ - 0.01){
      prevLookAt.x = newLookAt.x
      prevLookAt.y = newLookAt.y
      prevLookAt.z = newLookAt.z
    }


    camera.position.lerp(vec.set(state.x, state.y, 3), 0.05)
    camera.lookAt(newLookAt.x, newLookAt.y, newLookAt.z)

    // if(!state.wait){
    //   moveLookAt()
    // }else{
    //   cameraMove()
    //   camera.lookAt(state.lookAtX, state.lookAtY, state.lookAtZ)
    // }

  })

  const moveLookAt = () => {
    camera.lookAt( vec.lerp(vecLookAt.set(state.lookAtX, state.lookAtY, state.lookAtZ), 0.05) )
  }

  const cameraMove = () => {
    camera.position.lerp(vec.set(state.x, state.y, 3), 0.05)
  }

  const clicked = (position) => {
    
    state.lookAtX = position.x
    state.lookAtY = position.y
    state.lookAtZ = position.z

    state.x = position.x
    state.y = position.y
    state.z = position.z

    // if(!state.wait){
    //   state.lookAtX = position.x
    //   state.lookAtY = position.y
    //   state.lookAtZ = position.z

    //   setTimeout(() => {
    //     state.wait = true
    //   }, 1000);

    //   setTimeout(() => {
    //     state.x = position.x
    //     state.y = position.y
    //     state.z = position.z
    //   }, 1001);

    //   setTimeout(() => {
    //     state.wait = false
    //   }, 4000);
    // }

  }

  return(
    
    <group>
      <mesh position={[-1,1,0]} onClick={() => {clicked({x: -1, y: 1, z: 0})}}>
        <boxBufferGeometry args={[1,1,1]} />
        <meshBasicMaterial attach="material" color="green" />
      </mesh>
      <mesh position={[1,1,0]} onClick={() => {clicked({x: 1, y: 1, z: 0})}}>
        <boxBufferGeometry args={[1,1,1]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
      <mesh position={[1,-1,0]} onClick={() => {clicked({x: 1, y: -1, z: 0})}}>
        <boxBufferGeometry args={[1,1,1]} />
        <meshBasicMaterial attach="material" color="blue" />
      </mesh>
      <mesh position={[-1,-1,0]} onClick={() => {clicked({x: -1, y: -1, z: 0})}}>
        <boxBufferGeometry args={[1,1,1]} />
        <meshBasicMaterial attach="material" color="yellow" />
      </mesh>
    </group>
    
  )

}


function App() {

  return (
    <div id="canvas-container">
      <Canvas
        camera={{position: [0,0,3]}}
      >       
        <CameraMove />
      </Canvas>
    </div>
  );
}

export default App;
