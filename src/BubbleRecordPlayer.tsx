import { useRef, useMemo, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere, MeshTransmissionMaterial, Text } from '@react-three/drei'
import { useMusicStore, Track } from './store'

interface FloatingBubbleProps {
  track: Track
  position: [number, number, number]
  delay: number
  onSelect: (track: Track) => void
}

function FloatingBubble({ track, position, delay, onSelect }: FloatingBubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const time = useRef(delay)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    time.current += delta
    
    // 浮遊アニメーション
    const float = Math.sin(time.current * 0.8 + delay) * 0.3
    const drift = Math.cos(time.current * 0.5 + delay) * 0.2
    meshRef.current.position.y = position[1] + float
    meshRef.current.position.x = position[0] + drift
    
    // ゆっくり回転
    meshRef.current.rotation.y += delta * 0.3
    meshRef.current.rotation.x += delta * 0.1
    
    // ホバー時のスケール
    const targetScale = hovered ? 1.2 : 1
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 5
    )
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(track)
  }

  return (
    <group>
      <Sphere 
        ref={meshRef} 
        args={[0.25, 32, 32]} 
        position={position}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.3}
          roughness={0.05}
          chromaticAberration={0.6}
          anisotropy={1}
          distortion={0.4}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color={track.color}
          emissive={track.color}
          emissiveIntensity={hovered ? 2 : 0.8}
        />
      </Sphere>
      
      {hovered && (
        <Text
          position={[position[0], position[1] - 0.5, position[2]]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {track.title}
        </Text>
      )}
    </group>
  )
}

function RecordBubble({ track, isPlaying }: { track: Track; isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const bubbleRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)
  
  useFrame((state, delta) => {
    if (!groupRef.current || !bubbleRef.current) return
    
    time.current += delta
    
    // レコードとして回転
    if (isPlaying) {
      groupRef.current.rotation.y += delta * 2
    }
    
    // シャボン玉の微細な動き
    const pulse = Math.sin(time.current * 2) * 0.02
    bubbleRef.current.scale.setScalar(1 + pulse)
    
    // 発光の強さ
    const material = bubbleRef.current.material as any
    if (material.emissiveIntensity !== undefined) {
      const intensity = isPlaying ? 1.5 + Math.sin(time.current * 3) * 0.5 : 0.5
      material.emissiveIntensity = intensity
    }
  })

  return (
    <group ref={groupRef}>
      {/* レコード盤（シャボン玉の台座） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 64]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* 中心の穴 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.06, 32]} />
        <meshStandardMaterial 
          color={track.color}
          emissive={track.color}
          emissiveIntensity={isPlaying ? 1.5 : 0.5}
        />
      </mesh>
      
      {/* 溝のライン */}
      {Array.from({ length: 15 }).map((_, i) => {
        const radius = 0.3 + (i * 0.08)
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
            <torusGeometry args={[radius, 0.005, 8, 64]} />
            <meshStandardMaterial 
              color="#333"
              emissive={track.color}
              emissiveIntensity={isPlaying ? 0.3 : 0.05}
            />
          </mesh>
        )
      })}
      
      {/* メインのシャボン玉（レコード上） */}
      <Sphere ref={bubbleRef} args={[0.6, 32, 32]} position={[0, 0.8, 0]}>
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.4}
          roughness={0.05}
          chromaticAberration={0.8}
          anisotropy={1}
          distortion={0.5}
          distortionScale={0.6}
          temporalDistortion={0.2}
          color={track.color}
          emissive={track.color}
          emissiveIntensity={isPlaying ? 2 : 0.5}
        />
      </Sphere>
    </group>
  )
}

function ToneArm({ isPlaying }: { isPlaying: boolean }) {
  const armRef = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (!armRef.current) return
    
    // レコードに降りる/上がるアニメーション
    const targetRotation = isPlaying ? -0.5 : -0.3
    armRef.current.rotation.z += (targetRotation - armRef.current.rotation.z) * delta * 3
  })

  return (
    <group ref={armRef} position={[1.8, 0.3, 0]}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 16]} />
        <meshStandardMaterial 
          color="#666"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* 針先 */}
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color="#8a2be2"
          emissive="#8a2be2"
          emissiveIntensity={isPlaying ? 1 : 0.3}
        />
      </mesh>
    </group>
  )
}

export function BubbleRecordPlayer() {
  const { tracks, currentTrack, isPlaying, setCurrentTrack } = useMusicStore()
  
  // 空中に浮かぶシャボン玉の位置
  const floatingPositions = useMemo(() => {
    return tracks
      .filter(t => t.id !== currentTrack?.id)
      .map((track, i) => {
        const angle = (i / (tracks.length - 1)) * Math.PI * 2
        const radius = 3 + Math.random() * 0.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = 1.5 + Math.random() * 1.5
        return { track, position: [x, y, z] as [number, number, number], delay: i * 0.8 }
      })
  }, [tracks, currentTrack])

  if (!currentTrack) return null

  return (
    <group>
      {/* ベース台 */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.2, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* 現在再生中のレコード＝シャボン玉 */}
      <RecordBubble track={currentTrack} isPlaying={isPlaying} />
      
      {/* トーンアーム */}
      <ToneArm isPlaying={isPlaying} />
      
      {/* 空中に浮かぶ他の曲のシャボン玉 */}
      {floatingPositions.map(({ track, position, delay }) => (
        <FloatingBubble
          key={track.id}
          track={track}
          position={position}
          delay={delay}
          onSelect={setCurrentTrack}
        />
      ))}
    </group>
  )
}
