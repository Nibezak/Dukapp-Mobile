import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeContext } from '../../App';

export default function Header(props) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.header}>
      <StatusBar style={theme.statusbar} />
      <View style={styles.headerChildren}>{props.children}</View>
    </View>
  );
}

const styles = {
  header: {
    height: 50,
    backgroundColor: '#f1f1f1',
    padding: 1,
    marginBottom: 10,
  },
  headerChildren: {
    flex: 1,
    flexDirection: 'row',
  },
};
