import { useEffect, useState } from 'react'
import { useMachine } from '../../state/MachineContext'

export function Beam({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color="#394858" roughness={0.58} metalness={0.55} />
    </mesh>
  )
}

export function ContainerFrame() {
  return (
    <group>
      <Beam position={[0, -1.48, 0]} scale={[12.9, 0.18, 3.4]} />
      <Beam position={[0, 3.02, -1.62]} scale={[12.9, 0.16, 0.16]} />
      <Beam position={[0, 3.02, 1.62]} scale={[12.9, 0.16, 0.16]} />
      <Beam position={[-6.38, 0.78, -1.62]} scale={[0.16, 4.5, 0.16]} />
      <Beam position={[6.38, 0.78, -1.62]} scale={[0.16, 4.5, 0.16]} />
      <Beam position={[-6.38, 0.78, 1.62]} scale={[0.16, 4.5, 0.16]} />
      <Beam position={[6.38, 0.78, 1.62]} scale={[0.16, 4.5, 0.16]} />
      <mesh position={[0, 0.78, -1.7]}>
        <boxGeometry args={[12.5, 4.25, 0.08]} />
        <meshStandardMaterial color="#c3c8cb" roughness={0.82} />
      </mesh>
    </group>
  )
}

export function Pretreatment() {
  return (
    <group position={[-4.55, -0.25, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 3.15, 24]} />
        <meshStandardMaterial color="#2e83a9" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[1.2, -0.1, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 2.35, 20]} />
        <meshStandardMaterial color="#d6dfe6" roughness={0.45} />
      </mesh>
    </group>
  )
}

export function HighPressurePump() {
  return (
    <group position={[-0.8, -0.25, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.4, 0.48, 2.35, 24]} />
        <meshStandardMaterial color="#aeb8bd" roughness={0.32} metalness={0.72} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 24]} />
        <meshStandardMaterial color="#181d22" roughness={0.62} metalness={0.28} />
      </mesh>
    </group>
  )
}

export function Piping() {
  return (
    <group>
      <mesh position={[0.2, -0.88, 0.72]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 10.6, 16]} />
        <meshStandardMaterial color="#242c33" roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[3.55, 0.05, -0.7]}>
        <cylinderGeometry args={[0.09, 0.09, 2.4, 16]} />
        <meshStandardMaterial color="#737e84" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

export function ElectricalCabinet() {
  return (
    <group position={[5.45, 0.15, -0.65]}>
      <mesh>
        <boxGeometry args={[1.1, 2.55, 0.48]} />
        <meshStandardMaterial color="#d8dbd9" roughness={0.72} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.45, 0.255]}>
        <boxGeometry args={[0.55, 0.38, 0.04]} />
        <meshStandardMaterial color="#172027" roughness={0.45} />
      </mesh>
    </group>
  )
}

export function Membranes() {
  const { selectedEquipment, selectEquipment } = useMachine()
  const [hovered, setHovered] = useState(false)
  const selected = selectedEquipment === 'membranes'

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'default'
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [hovered])

  const materialColor = selected ? '#dcecf2' : hovered ? '#f2f5f4' : '#e3e7e7'
  const emissive = selected ? '#315c69' : hovered ? '#183640' : '#000000'

  return (
    <group
      position={[2.35, 0.3, 0]}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        selectEquipment('membranes')
      }}
    >
      {[-0.95, -0.3, 0.35, 1.0].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 4.6, 20]} />
          <meshStandardMaterial
            color={materialColor}
            emissive={emissive}
            emissiveIntensity={selected ? 0.65 : hovered ? 0.25 : 0}
            roughness={0.34}
            metalness={0.08}
          />
        </mesh>
      ))}
      <Beam position={[-2.15, 0.05, 0]} scale={[0.10, 2.8, 0.7]} />
      <Beam position={[2.15, 0.05, 0]} scale={[0.10, 2.8, 0.7]} />
    </group>
  )
}

