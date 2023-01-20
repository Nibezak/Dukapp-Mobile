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
      <TouchableOpacity onPress={() => navigation.navigate(route)} style={styles.container}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          </View>
        </View>

        <View style={styles.rowText}>
          <Text style={styles.value}>{value}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  card: {
    padding: 20,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e0",
  },
  rowText: {
    marginBottom: 30,
  }
};
