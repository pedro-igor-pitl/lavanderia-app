import { View, Text, StyleSheet } from 'react-native';

export default function Financeiro() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financeiro</Text>

      <View style={styles.card}>
        <Text style={styles.text}>🟡 João Silva - R$ 320</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>🔴 Maria - R$ 540</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>🟢 Hotel - OK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});