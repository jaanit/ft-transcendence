"use client"

import * as THREE from "three"
import { MeshTransmissionMaterial, RoundedBox, useTexture } from "@react-three/drei"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import grass from "../assets/ground.jpg"

export function Ground() {
    return (
      
        <mesh receiveShadow position={[0, -200, 0]} rotation-x={-Math.PI / 2}>
          <RoundedBox args={[1010, 615,50]} >
            <meshPhysicalMaterial color="white" clearcoat={1} clearcoatRoughness={0} roughness={0} metalness={0.5} />
          </RoundedBox>
        </mesh>

        
      
    )
}



