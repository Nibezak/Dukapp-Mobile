import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import * as Analytics from 'expo-firebase-analytics';
import { getSetting } from '../models/AsyncStorage';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../App';
import { t } from 'i18n-js';

export default function SideBar() {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    retrieveSetting();
  });

  const HomeIcon = <AntDesign name="home" size={24} color={theme.primary} />;
  const SupplierIcon = (
    <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={theme.primary} />
  );
  const ReportInsightsIcon = <Feather name="bar-chart" size={24} color={theme.primary} />;
  const ReceiptsIcon = <Ionicons name="ios-receipt-outline" size={24} color={theme.primary} />;
  const ShareIcon = <AntDesign name="sharealt" size={24} color={theme.primary} />;
  const BankIcon = <Ionicons name="card-outline" size={24} color={theme.primary} />;

  const [selectedId, setSelectedId] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const listArrayItem = [
    { icon: HomeIcon, title: `${t('screens.home')}`, route: 'HomeScreen' },
    // { icon: SupplierIcon, title: 'Suppliers', route: 'Supplier List' },
    { icon: ReceiptsIcon, title: `${t('screens.receipts')}`, route: 'Sale Receipt' },
    // { icon: BankIcon, title: 'Transactions', route: 'SMS Transactions' },
    { icon: ReportInsightsIcon, title: `${t('screens.reportInsights')}`, route: 'Insights' },
  ];

  const bottomListItems = [{ icon: ShareIcon, title: `${t('screens.share')}` }];

  const navigation = useNavigation();

  const Item = ({ title, icon, onPress, backgroundColor, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor: backgroundColor }]}>
      <View>
        <Text style={{ color: color }}>{icon}</Text>
      </View>
      <Text style={[styles.title, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );
  function navigate(item) {
    setSelectedId(item.title);
    navigation.navigate(item.route, {
      order_type: 'sale',
    });
  }

  // share a link to other friends
  const onShare = async () => {
    try {
      const imageUrl = Image.resolveAssetSource(require('./../../assets/icon.png')).uri;
      Analytics.logEvent('share', {
        shop: businessName,
        method: 'share',
      });
      await Share.share({
        title: 'Download Dukapp :)',
        message:
          '😄 we invite you to download dukapp it is a simple, secure, reliable management and insights tool to grow your business 💯.🔥 shorturl.at/swyL0 🔥',
        url: imageUrl,
        // specify the type of the image
        type: 'image/png',
        // include the image in the share content
        // you can also use local image URI
        // e.g., `Image.resolveAssetSource(require('./image.png')).uri`
        files: [imageUrl],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        onPress={() => navigate(item)}
        title={item.title}
        backgroundColor={theme.background}
        color={theme.text}
        icon={item.icon}
      />
    );
  };

  const renderLinks = ({ item }) => {
    return (
      <Item
        onPress={onShare}
        title={item.title}
        backgroundColor={theme.background}
        color={theme.text}
        icon={item.icon}
      />
    );
  };

  function retrieveSetting() {
    getSetting('business_name').then(setBusinessName);
    getSetting('app_default_currency').then(setCurrency);
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ justifyContent: 'center', flex: 0.35, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Image
            source={
              theme.theme === 'light'
                ? require('./../../assets/snack-icon.png')
                : require('./../../assets/snack-icon-dark.png')
            }
            style={{ width: 120, height: 70 }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.primary }}>
            {businessName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
            backgroundColor: 'rgba(16, 185, 120, 0.7)',
            paddingHorizontal: 5,
            paddingVertical: 6,
            borderRadius: 10,
          }}
        >
          <FontAwesome5 name="money-check-alt" size={24} color="#f1f1f1" />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: '#f1f1f1',
              paddingHorizontal: 5,
              fontFamily: 'sans-serif',
            }}
          >
            {currency}
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.55 }}>
        <FlatList data={listArrayItem} renderItem={renderItem} />
      </View>
      <View style={{ flex: 0.25 }}></View>
      <View style={{ flex: 0.1 }}>
        <FlatList data={bottomListItems} renderItem={renderLinks} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    padding: 20,
    paddingVertical: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    marginLeft: 20,
    paddingLeft: 20,
    fontWeight: 'bold',
    color: '#47a67f',
  },
});
