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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/cliente-relatorios?id=${item.id}`)}
          >
            <Text style={styles.text}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />

      {clientes.length === 0 && (
        <Text style={{ color: '#777' }}>
          Nenhum cliente cadastrado
        </Text>
      )}
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
  },
});