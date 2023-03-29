import { t } from 'i18n-js';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ButtonFilled from './ButtonFilled';
import { useNavigation } from '@react-navigation/native';
export function StockItemAnimation(props) {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = props;

  return (
    <View style={[styles.container, { width }]}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Image
          source={require('../../assets/WelcomeAnimation/welcomeStock.png')}
          style={[styles.image, { width, resizeMode: 'contain' }]}
        />
        <Text style={[styles.title, { color: theme.primary }]}>
          {t('welcome.screen_header_stock')}
        </Text>
        <Text style={[styles.description, { color: theme.text, opacity: 0.7 }]}>
          {t('welcome.screen_description')}
        </Text>
        <View>
          <ButtonFilled onPress={() => navigation.navigate('New Item')} color={theme.primary}>
            {t('welcome.create_item_in_stock')}
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
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
});
