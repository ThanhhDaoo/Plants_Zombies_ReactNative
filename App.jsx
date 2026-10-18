import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { WebView } from 'react-native-webview';

const LOCAL_ASSET_URI = 'file:///android_asset/web/index.html';
const ONLINE_URL = 'https://plantzombies.vercel.app';

export default function App() {
  const [useOnline, setUseOnline] = useState(Platform.OS !== 'android');
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  useEffect(() => {
    async function lockOrientation() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        // Fallback on web/simulator
      }
    }
    lockOrientation();
  }, []);

  const source = useOnline ? { uri: ONLINE_URL } : { uri: LOCAL_ASSET_URI };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
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
        onLoadEnd={() => setLoading(false)}
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
