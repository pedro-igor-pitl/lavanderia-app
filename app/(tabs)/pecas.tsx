import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function Pecas() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [lista, setLista] = useState<any[]>([]);

  const adicionarPeca = () => {
    if (!nome || !preco) return;

    const novaPeca = {
      id: Date.now().toString(),
      nome,
      preco,
    };

    setLista([...lista, novaPeca]);
    setNome('');
    setPreco('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Peças</Text>

      <TextInput
        placeholder="Nome da peça"
        placeholderTextColor="#777"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Preço por Kg (R$)"
        placeholderTextColor="#777"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={adicionarPeca}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.nome}</Text>
            <Text style={styles.price}>R$ {item.preco}</Text>
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
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  price: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});