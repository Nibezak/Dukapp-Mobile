import { t } from 'i18n-js';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ButtonFilled from './ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../../App';
export function WelcomeAnimation() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { width }]}>
      <View style={{ flex: 1, paddingHorizontal: 3 }}>
        <Image
          source={require('../../assets/WelcomeAnimation/welcome.png')}
          style={[styles.image, { width, resizeMode: 'contain' }]}
        />
        <Text style={styles.title}>Quick and easy Data management</Text>
        <Text style={[styles.description, { color: theme.text }]}>
          manage products in your stock, calculate income and revenue for you , and create receipts
        </Text>
        <View>
          <ButtonFilled
            onPress={() =>
              navigation.navigate('Orders', {
                order_type: 'sale',
              })
            }
            color={theme.primary}
          >
            {t('welcome.place_an_order')}
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
    paddingHorizontal: 5,
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    paddingHorizontal: 64,
    opacity: 0.7,
  },
});
