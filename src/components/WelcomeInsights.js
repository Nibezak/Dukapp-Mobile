import { t } from 'i18n-js';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import ButtonFilled from './ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../../App';
export function WelcomeInsights() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { width, backgroundColor: theme.background }]}>
      <View style={{ flex: 1, backgroundColor: theme.background, paddingHorizontal: 3 }}>
        <Image
          source={require('../../assets/WelcomeAnimation/WelcomeInsights.png')}
          style={[styles.image, { width, resizeMode: 'contain' }]}
        />
        <Text style={[styles.title, { color: theme.primary }]}>Records and Insights</Text>
        <Text style={[styles.description, { color: theme.text, opacity: 0.7 }]}>
          Go back in history to see how you did on other dates as well
        </Text>
        <View>
          <ButtonFilled
            onPress={() =>
              navigation.navigate('Orders', {
                order_type: 'sale',
              })
            }
            color={theme.primary}
            labelColor={theme.text}
          >
            {t('welcome.place_an_order') + ' FIRST'}
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
