import { create } from 'zustand'

export interface Track {
  id: number
  title: string
  color: string
  audioUrl: string
}

interface MusicState {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  audioRef: HTMLAudioElement | null
  setCurrentTrack: (track: Track) => void
  togglePlay: () => void
  setAudioRef: (ref: HTMLAudioElement) => void
}

const TRACKS: Track[] = [
  { id: 1, title: 'Bollywood GQOM', color: '#4169E1', audioUrl: '/tracks/track1.wav' },
  { id: 2, title: 'Complex Funky Tech', color: '#FF6B6B', audioUrl: '/tracks/track2.wav' },
  { id: 3, title: 'DNB Remix', color: '#51CF66', audioUrl: '/tracks/track3.wav' },
  { id: 4, title: 'Dubby DNB', color: '#9775FA', audioUrl: '/tracks/track4.wav' },
]

export const useMusicStore = create<MusicState>((set, get) => ({
  tracks: TRACKS,
  currentTrack: TRACKS[0],
  isPlaying: false,
  audioRef: null,
  setAudioRef: (ref) => {
    console.log('[Audio] Audio element initialized', ref)
    set({ audioRef: ref })
  },
  setCurrentTrack: (track) => {
    const state = get()
    console.log('[Audio] Switching to track:', track.title, 'URL:', track.audioUrl)
    if (state.audioRef) {
      state.audioRef.src = track.audioUrl
      console.log('[Audio] Audio src set to:', state.audioRef.src)
      state.audioRef.play().then(() => {
        console.log('[Audio] Playing:', track.title)
      }).catch((err) => {
        console.error('[Audio] Play error:', err)
      })
    } else {
      console.error('[Audio] No audio ref available')
    }
    set({ currentTrack: track, isPlaying: true })
  },
  togglePlay: () => {
    const state = get()
    if (state.audioRef) {
      if (state.isPlaying) {
        state.audioRef.pause()
        console.log('[Audio] Paused')
      } else {
        state.audioRef.play().catch((err) => {
          console.error('[Audio] Play error:', err)
        })
        console.log('[Audio] Resumed')
      }
    } else {
      console.error('[Audio] No audio ref available')
    }
    set({ isPlaying: !state.isPlaying })
  },
}))
