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
import { Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Pecas() {
  const [pecas, setPecas] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const scaleAnim = useState(new Animated.Value(1))[0];

  const atualizarStatus = async (id: string, ativo: boolean) => {
    try {
      await api.patch(`/pecas/atualizarStatus/${id}`, {
        ativo: !ativo
      });

      // atualização local
      setPecas(prev =>
        prev.map(p =>
          p.id === id ? { ...p, ativo: !p.ativo } : p
        )
      );

    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

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

            <TouchableOpacity
              onPress={() => atualizarStatus(item.id, item.ativo)}
              style={styles.statusButton}
              activeOpacity={0.6}
            >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <MaterialIcons
                name={item.ativo ? 'toggle-on' : 'toggle-off'}
                size={36}
                color={item.ativo ? '#22C55E' : '#EF4444'}
              />
            </Animated.View>
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
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
  },

  statusText: {
    fontSize: 18,
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