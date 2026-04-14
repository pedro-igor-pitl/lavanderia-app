import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../components/AppContext';

export default function FaturamentoClientes() {
  const { clientes = [] } = useApp();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Cliente</Text>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum cliente cadastrado
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/faturamento-periodo?clienteId=${item.id}`)
            }
          >
            <Text style={styles.text}>{item.nome}</Text>

            {/* 🔥 INFO EXTRA */}
            <Text style={styles.sub}>
              Tipo: {item.tipo} | Período: {item.periodo}
            </Text>
          </TouchableOpacity>
        )}
      />
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
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  sub: {
    color: '#777',
    marginTop: 5,
    fontSize: 12,
  },
  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});