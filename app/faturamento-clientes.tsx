import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';

import { useRouter } from 'expo-router';
import api from '../app/services/api';

export default function FaturamentoClientes() {
  const [clientesResumido, setClientesResumido] = useState<any[]>([]);
  const [busca, setBusca] = useState('');

  // MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  // PERIODOS
  const [periodoInicial, setPeriodoInicial] = useState('');
  const [periodoFinal, setPeriodoFinal] = useState('');

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

  const abrirModalPeriodo = (cliente: any) => {
    setClienteSelecionado(cliente);
    setPeriodoInicial('');
    setPeriodoFinal('');
    setModalVisible(true);
  };

  const confirmarPeriodo = () => {
    if (!clienteSelecionado) return;

    setModalVisible(false);

    router.push(
      `/faturamento-periodo?clienteId=${clienteSelecionado.id}&inicio=${periodoInicial}&fim=${periodoFinal}`
    );
  };

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
            onPress={() => abrirModalPeriodo(item)}
          >
            <Text style={styles.text}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Selecionar Período
            </Text>

            <Text style={styles.modalLabel}>
              Período Inicial
            </Text>

            <TextInput
              placeholder="Ex: 01/05/2026"
              placeholderTextColor="#777"
              value={periodoInicial}
              onChangeText={setPeriodoInicial}
              style={styles.modalInput}
            />

            <Text style={styles.modalLabel}>
              Período Final
            </Text>

            <TextInput
              placeholder="Ex: 31/05/2026"
              placeholderTextColor="#777"
              value={periodoFinal}
              onChangeText={setPeriodoFinal}
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={confirmarPeriodo}
            >
              <Text style={styles.buttonText}>
                Confirmar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },

  modalLabel: {
    color: '#aaa',
    marginBottom: 6,
    marginTop: 10,
  },

  modalInput: {
    backgroundColor: '#2A2A2E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },

  cancelButton: {
    backgroundColor: '#444',
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});