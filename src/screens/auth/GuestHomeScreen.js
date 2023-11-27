import { t } from 'i18n-js';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { OnboardFlow } from 'react-native-onboard';
import { useNavigation } from '@react-navigation/native';

export default function GuestHomeScreen() {
  const navigation = useNavigation();

  async function redirect() {
    return navigation.navigate('PhoneNumber');
  }

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <OnboardFlow
          pages={[
            {
              title: `${t('onBoard.welcome')}`,
              subtitle: `${t('onBoard.thank_you_for_choosing')}`,
              imageUri: Image.resolveAssetSource(
                require('./../../../assets/WelcomeAnimation/welcomejoyride.png')
              ).uri,
            },
            {
              title: `${t('onBoard.safe_and_secure')}`,
              subtitle: `${t('onBoard.safe_and_securesafe_and_secure')}`,
              imageUri: Image.resolveAssetSource(
                require('./../../../assets/WelcomeAnimation/welcomesecurestep.png')
              ).uri,
            },
            {
              title: `${t('onBoard.one_final_step')}`,
              subtitle: `${t('onBoard.your_profile')}`,
              imageUri: Image.resolveAssetSource(
                require('./../../../assets/WelcomeAnimation/welcomelaststep.png')
              ).uri,
              primaryButtonTitle: t('onBoard.start'), // Add "Get Started" button
            },
          ]}
          type="fullscreen" // Change to either 'fullscreen', 'bottom-sheet', or 'inline'
          onDone={redirect} // Pass the function reference without calling it
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
