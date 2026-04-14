import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '../components/AppContext';

export default function ClienteRelatorios() {
  const { id } = useLocalSearchParams();
  const { relatorios = [] } = useApp();

  const lista = relatorios.filter((r: any) => r.clienteId === id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      {lista.length === 0 && (
        <Text style={{ color: '#777' }}>Nenhum relatório encontrado</Text>
      )}

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              {item.dataInicio} até {item.dataFim}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(item.pdfUrl)}
            >
              <Text style={styles.buttonText}>Abrir PDF</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});