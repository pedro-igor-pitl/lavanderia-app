import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

import { useRouter } from 'expo-router';
import api from '../app/services/api';

export default function FaturamentoClientes() {
  const [clientesResumido, setClientesResumido] = useState<any[]>([]);
  const [busca, setBusca] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const response = await api.get(
          '/cliente/listarClientesResumido?ativo=True'
        );

        setClientesResumido(response.data);

        console.log('Dados de clientes resumidos:', response.data);
      } catch (error) {
        console.log('Erro ao buscar clientes:', error);
      }
    }

    carregarUsuarios();
  }, []);

  const clientesFiltrados = useMemo(() => {
    return clientesResumido.filter((cliente) =>
      cliente.nome
        ?.toLowerCase()
        .includes(busca.toLowerCase())
    );
  }, [busca, clientesResumido]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Cliente</Text>

      <TextInput
        placeholder="Buscar cliente..."
        placeholderTextColor="#777"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum cliente encontrado
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/faturamento-periodo?clienteId=${item.id}`
              )
            }
          >
            <Text style={styles.text}>
              {item.nome}
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

  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
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
    fontSize: 16,
  },

  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});