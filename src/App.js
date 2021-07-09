import './App.css';
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
// import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import create from 'zustand'
import { lerp } from 'three/src/math/MathUtils';
import { Stats } from '@react-three/drei';


const useStore = create((set) => ({
  x: 0,
  y: 0,
  z: 0,
  lookAtX: 0,
  lookAtY: 0,
  lookAtZ: 0,
  movingX: false,
  movingY: false,
  movingZ: false,
  changeLookAT: (position) => set(() => ({ x: position.x, y: position.y, z: position.z })),
  center: () => set({ x: 0, y: 0, z: 0 }),
}))

const CameraMove = () => {

  const state = useStore((state) => state)

  const { camera, clock } = useThree()
  const vec = new THREE.Vector3()

  let prevLookAt = {
    x: state.lookAtX,
    y: state.lookAtY,
    z: state.lookAtZ
  }

  let initDelta = 0
  let transitionTime = 2

  useFrame(() => {

    const elapsedTime = clock.getElapsedTime() - initDelta;

    const newLookAt = {
      x: lerp( (prevLookAt.x), state.lookAtX, (elapsedTime % transitionTime) / transitionTime),
      y: lerp( (prevLookAt.y), state.lookAtY, (elapsedTime % transitionTime) / transitionTime),
      z: lerp( (prevLookAt.z), state.lookAtZ, (elapsedTime % transitionTime) / transitionTime)
    }

    if( Math.abs(state.lookAtX - newLookAt.x) <= 0.02 ){
      prevLookAt.x = state.lookAtX
      state.movingX = false
    }
    if( Math.abs(state.lookAtY - newLookAt.y) <= 0.02 ){
      prevLookAt.y = state.lookAtY
      state.movingY = false
    }
    if( Math.abs(state.lookAtZ - newLookAt.z) <= 0.02 ){
      prevLookAt.z = state.lookAtZ
      state.movingZ = false
    }

    camera.position.lerp(vec.set(state.x, state.y, 3), 0.05)
    camera.lookAt(newLookAt.x, newLookAt.y, newLookAt.z)


  })


  const clicked = (position) => {

    if(!state.movingX && !state.movingY && !state.movingZ){

      state.movingX = true
      state.movingY = true
      state.movingZ = true

      initDelta = clock.getElapsedTime()
  
      state.lookAtX = position.x
      state.lookAtY = position.y
      state.lookAtZ = position.z
  
      state.x = position.x
      state.y = position.y
      state.z = position.z
    }


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
      <div id="test" />
      <Canvas
        camera={{position: [0,0,3]}}
      >       
        <CameraMove />
        <Stats parent="test" ></Stats>
      </Canvas>
    </div>
  );
}

export default App;
