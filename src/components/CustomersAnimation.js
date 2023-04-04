import { t } from 'i18n-js';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ButtonFilled from './ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../App';
import { useContext } from 'react';
export function CustomersAnimation() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { width }]}>
      <View style={{ flex: 1, backgroundColor: theme.background, paddingHorizontal: 5 }}>
        <Image
          source={require('../../assets/WelcomeAnimation/WelcomeCustomers.png')}
          style={[styles.image, { width, resizeMode: 'contain' }]}
        />
        <Text style={[styles.title, { color: theme.primary }]}>
          {t('customer.welcome_screen_header')}
        </Text>
        <Text style={[styles.description, { color: theme.text, opacity: 0.7 }]}>
          {t('customer.welcome_screen_description')}
        </Text>
        <View>
          <ButtonFilled
            onPress={() => navigation.navigate(`${t('screens.newCustomer')}`)}
            color={theme.primary}
            labelColor={theme.text}
          >
            {t('customer.welcome_screen_add_customer')}
          </ButtonFilled>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    alignSelf: 'center',
    marginBottom: 10,
    color: '#47a67f',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
});
