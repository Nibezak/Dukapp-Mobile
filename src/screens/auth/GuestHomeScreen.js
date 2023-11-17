import { Text, View, StyleSheet } from 'react-native';
import { OnboardFlow } from 'react-native-onboard';


export default function GuestHomeScreen() {
  return (
    <View style={styles.container}>
      <OnboardFlow pages={[
        {
          title: 'Welcome to my app',
          subtitle: 'Connect your bank account now and start saving money.',
          imageUri: 'https://frigade.com/img/demo.png'
        },
        {
          title: 'Buy cool stuff',
          subtitle: 'Remember that ice cream you wanted to buy?',
          imageUri: 'https://illlustrations.co/static/15d8c30e1f77fd78c3b83b9fca9c3a92/day81-ice-cream.png'
        },
        {
          title: 'The right tools',
          subtitle: 'Our app can do anything. Literally anything. We are that good.',
          imageUri: 'https://illlustrations.co/static/a547d1bc532ad86a13dd8f47d754f0a1/day77-pocket-knief.png'
        }
      ]}
        type='inline' // Change to either 'fullscreen', 'bottom-sheet', or 'inline'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
