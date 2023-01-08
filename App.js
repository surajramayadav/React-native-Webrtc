import { View, Text } from 'react-native'
import React from 'react'
import Navigation from './src/route/navigation'
import { VideoContextProvider } from './src/context/videoContext'
import VideoModal from './src/components/videoCallModal/videoModal'

export default function App() {
  return (
    <VideoContextProvider>
      <VideoModal />
      <Navigation />
    </VideoContextProvider>
  )
}