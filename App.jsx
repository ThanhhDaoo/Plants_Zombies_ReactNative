import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    async function lockOrientation() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        // Fallback on web or unsupported platforms
      }
    }
    lockOrientation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {currentScreen === 'home' ? (
        <HomeScreen onStartGame={() => setCurrentScreen('game')} />
      ) : (
        <GameScreen onBackToMenu={() => setCurrentScreen('home')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
