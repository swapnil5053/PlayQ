import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export default function UserListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Database (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundBase, justifyContent: 'center', alignItems: 'center' },
  text: { color: COLORS.whiteTextPrimary, fontFamily: 'Montserrat_500Medium' }
});
