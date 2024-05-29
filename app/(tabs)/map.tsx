import { Image, StyleSheet, Platform, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.Mapcontainer}>
      <MapView style={styles.map} />
    </View>

  );
}

const styles = StyleSheet.create({
  Container: {
   flex: 1
  },
  Mapcontainer: {
    
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
});
