import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { useApp } from '../../components/AppContext';
import api from '../services/api';
import { useEffect } from 'react';

export default function Pecas() {
  const [pecas, setPecas] = useState<any[]>([]);
  const [nome, setNome] = useState('');

  const adicionar = async () => {
    if (!nome.trim()) return;

    try {
      await api.post('/pecas/cadastrar', {
        nome: nome.trim(),
        ativo: true,
      });

      setNome('');

      // recarrega lista
      const response = await api.get('/pecas/listar');
      setPecas(response.data);

    } catch (error) {
      console.error('Erro ao adicionar peça:', error);
    }
  };

  useEffect(() => {
    async function carregarPecas() {
      try {
        const response = await api.get('/pecas/listar');
        setPecas(response.data);
      } catch (error) {
        console.error('Erro ao buscar peças:', error);
      }
    }

    carregarPecas();
  }, []);

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

      <TouchableOpacity style={styles.button} onPress={adicionar}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        data={pecas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma peça cadastrada</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.nome}</Text>
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
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});