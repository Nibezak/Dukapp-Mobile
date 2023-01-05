import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity } from 'react-native';

/**
 * Render individual Report Items
 *
 * @param {attribute} param0
 * @returns
 */
export function RenderReportItem({ value, title, titleColor, route }) {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate(route)}>
        <View style={styles.rowText}>
          <Text style={styles.value}>{value}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  rowText: {
    justifyContent: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    padding: 10,
    justifyContent: "center",

  },
  title: {
    width: 70
  },
  value: {
    textAlign: 'center',
    fontWeight: 'semi-bold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#4a5568',
  },
};
