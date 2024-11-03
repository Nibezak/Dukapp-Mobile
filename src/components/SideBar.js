import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share, FlatList } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import { getSetting } from '../models/AsyncStorage';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../App';
import { t } from 'i18n-js';

export default function SideBar() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [businessName, setBusinessName] = useState(null);
  const [currency, setCurrency] = useState(null);

  const listArrayItem = [
    { icon: <AntDesign name="home" size={24} color={"#292524"} />, title: `${t('screens.home')}`, route: 'HomeScreen' },
    { icon: <Ionicons name="receipt-outline" size={24} color={"#292524"} />, title: `${t('screens.receipts')}`, route: 'Sale Receipt' },
    { icon: <Feather name="bar-chart" size={24} color={"#292524"} />, title: `${t('screens.reportInsights')}`, route: 'Insights' },
    { icon: <MaterialIcons name="account-circle" size={24} color={"#292524"} />, title: `Account`, route: 'Insights' }, // Added Account item
  ];

  const bottomListItems = [{ icon: <AntDesign name="sharealt" size={24} color={"#292524"} />, title: `${t('screens.share')}` }];

  useEffect(() => {
    retrieveSetting();
  }, []);

  const retrieveSetting = () => {
    getSetting('business_name').then(setBusinessName);
    getSetting('app_default_currency').then(setCurrency);
  };

  const navigate = (item) => {
    navigation.navigate(item.route, { order_type: 'sale' });
  };

  const onShare = async () => {
    try {
      const imageUrl = Image.resolveAssetSource(require('./../../assets/dukapp-color.png')).uri;
      await Share.share({
        title: 'Download Dukapp :)',
        message: '😄 We invite you to download Dukapp, a simple, secure, reliable management tool to grow your business 💯. 🔥 shorturl.at/swyL0 🔥',
        url: imageUrl,
        type: 'image/png',
      });
      Analytics.logEvent('share', { shop: businessName, method: 'share' });
    } catch (error) {
      console.log(error.message);
    }
  };

  const Item = ({ title, icon, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item onPress={() => navigate(item)} title={item.title} icon={item.icon} />
  );

  const renderLinks = ({ item }) => (
    <Item onPress={onShare} title={item.title} icon={item.icon} />
  );

  return (
    <View style={[styles.container, { backgroundColor: "#E7E5E4" }]}>
      <View style={styles.header}>

        <Image source={require('./../../assets/dukapp-color.png')} style={styles.logo} />
      </View>
      <View style={styles.listContainer}>
        <FlatList data={listArrayItem} renderItem={renderItem} keyExtractor={(item) => item.title} />
      </View>
      <View style={styles.bottomContainer}>
        <FlatList data={bottomListItems} renderItem={renderLinks} keyExtractor={(item) => item.title} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    flex: 0.30
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    marginTop: 50,
  },
  businessName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#47a67f', // Retro color for business name
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#000', // Black border
    marginTop: 10,
  },
  currencyText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#f1f1f1',
    marginLeft: 5,
  },
  listContainer: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000', // Black border
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly transparent background
  },
  title: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#292524', // Retro color for text
  },
  bottomContainer: {
    marginBottom: 10,
  },
});
