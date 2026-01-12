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
      console.log('[App] Setting audio ref')
      setAudioRef(audioRef.current)
      
      // デバッグイベントリスナー
      audioRef.current.addEventListener('play', () => {
        console.log('[Audio Event] play')
      })
      audioRef.current.addEventListener('pause', () => {
        console.log('[Audio Event] pause')
      })
      audioRef.current.addEventListener('ended', () => {
        console.log('[Audio Event] ended')
      })
      audioRef.current.addEventListener('error', (e) => {
        console.error('[Audio Event] error:', e)
      })
      audioRef.current.addEventListener('canplay', () => {
        console.log('[Audio Event] canplay')
      })
    }
  }, [setAudioRef])

  return (
    <>
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        onLoadStart={() => console.log('[Audio] Loading...')}
        onLoadedData={() => console.log('[Audio] Data loaded')}
      />
      
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
