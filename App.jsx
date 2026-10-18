import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Text,
  AppState,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { WebView } from 'react-native-webview';

const LOCAL_ASSET_URI = 'file:///android_asset/web/index.html';
const ONLINE_URL = 'https://plantzombies.vercel.app';

const INJECTED_FULLSCREEN_JS = `
  (function() {
    try {
      document.body.classList.add('is-mobile-app');
      var meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      var gc = document.getElementById('gameContainer');
      if (gc) {
        gc.style.width = '100vw';
        gc.style.height = '100vh';
        gc.style.maxWidth = '100%';
        gc.style.maxHeight = '100%';
        gc.style.borderRadius = '0px';
        gc.style.boxShadow = 'none';
        gc.style.border = 'none';
        gc.style.margin = '0px';
      }
    } catch(e) {}
  })();
  true;
`;

export default function App() {
  const [useOnline, setUseOnline] = useState(Platform.OS !== 'android');
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  useEffect(() => {
    async function configureScreen() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        // Fallback on web/simulator
      }

      if (Platform.OS === 'android') {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
          await NavigationBar.setBackgroundColorAsync('#00000000');
        } catch (e) {
          // Fallback
        }
      }
    }
    configureScreen();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('hidden').catch(() => {});
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const source = useOnline ? { uri: ONLINE_URL } : { uri: LOCAL_ASSET_URI };

  return (
    <View style={styles.container}>
      <StatusBar hidden translucent backgroundColor="transparent" />
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={source}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mixedContentMode="always"
        scalesPageToFit={true}
        bounces={false}
        overScrollMode="never"
        scrollEnabled={false}
        injectedJavaScript={INJECTED_FULLSCREEN_JS}
        onLoadEnd={() => {
          setLoading(false);
          webViewRef.current?.injectJavaScript(INJECTED_FULLSCREEN_JS);
        }}
        onError={() => {
          if (!useOnline) {
            setUseOnline(true);
          }
        }}
      />
      {loading && (
        <View style={styles.loadingContainer} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffd54f" />
          <Text style={styles.loadingText}>Đang tải Chiến Trường Sinh Tồn...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c140d',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0c140d',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0c140d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a5d6a7',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
});
