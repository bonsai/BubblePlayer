import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { BubbleRecordPlayer } from './BubbleRecordPlayer'
import { useEffect, useRef } from 'react'
import { useMusicStore, Track } from './store'

export default function App() {
  const { isPlaying, currentTrack, togglePlay, setAudioRef } = useMusicStore()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current)
    }
  }, [setAudioRef])

  return (
    <>
      <audio ref={audioRef} crossOrigin="anonymous" />
      
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <BubbleRecordPlayer />
        
        <Environment preset="night" />
        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>

      <div className="controls">
        <button 
          onClick={togglePlay}
          className={isPlaying ? 'playing' : ''}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        {currentTrack && (
          <div style={{ 
            color: 'white', 
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            {currentTrack.title}
          </div>
        )}
      </div>
    </>
  )
}
