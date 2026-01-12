import { create } from 'zustand'

export interface Track {
  id: number
  title: string
  color: string
  audioUrl: string // ダミー
}

interface MusicState {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  setCurrentTrack: (track: Track) => void
  togglePlay: () => void
}

const TRACKS: Track[] = [
  { id: 1, title: '夜の海', color: '#4169E1', audioUrl: '/dummy1.wav' },
  { id: 2, title: '朝焼け', color: '#FF6B6B', audioUrl: '/dummy2.wav' },
  { id: 3, title: '森の中', color: '#51CF66', audioUrl: '/dummy3.wav' },
  { id: 4, title: '星空', color: '#9775FA', audioUrl: '/dummy4.wav' },
  { id: 5, title: '夕暮れ', color: '#FFA94D', audioUrl: '/dummy5.wav' },
  { id: 6, title: '雨音', color: '#74C0FC', audioUrl: '/dummy6.wav' },
]

export const useMusicStore = create<MusicState>((set) => ({
  tracks: TRACKS,
  currentTrack: TRACKS[0],
  isPlaying: false,
  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}))
