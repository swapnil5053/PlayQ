import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';

export default function GameManagementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Game Management (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundBase, justifyContent: 'center', alignItems: 'center' },
  text: { color: COLORS.whiteTextPrimary, fontFamily: 'Montserrat_500Medium' }
});
