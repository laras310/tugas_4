import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as WebBrowser from 'expo-web-browser';
import { BlurView } from 'expo-blur';
import styles from './style/stylesheet';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const terscan=({data})=>{
    setScanned(true);
    handleBarCodeScanned({data});
  };

  const handleBarCodeScanned = ({data}) =>
    Alert.alert(
      "Scan successful",
      `Barcode: ${data}. Redirect link?`,  
      [
        {
          text: "Cancel",
          onPress: () => console.log(scanned),
          style: "cancel"
        },
        { text: "OK", onPress: () => WebBrowser.openBrowserAsync(data)
        }
      ]
    );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : terscan}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && 
      <BlurView intensity={90} tint="light" style={styles.blurContainer}>
        <TouchableOpacity onPress={() => setScanned(false)}  style={styles.button}>
          <Text style={styles.text}>Tap to Scan Again</Text>
        </TouchableOpacity> 
      </BlurView>}
    </View>
  );
}

