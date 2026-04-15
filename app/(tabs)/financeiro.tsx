import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../components/AppContext';

export default function Financeiro() {
  const { periodos } = useApp();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financeiro</Text>

      {/* 🔥 BOTÃO PRINCIPAL */}
      <TouchableOpacity
        style={styles.faturamento}
        onPress={() => router.push('/faturamento-clientes')}
      >
        <Text style={styles.faturamentoText}>📄 Faturamento</Text>
      </TouchableOpacity>
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
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
  },
  subtitle: {
    color: '#aaa',
    marginTop: 20,
    marginBottom: 10,
  },
  faturamento: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  faturamentoText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});