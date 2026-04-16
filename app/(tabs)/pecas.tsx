import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function Pecas() {
  const [pecas, setPecas] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [modalVisible, setModalVisible] = useState(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<any>(null);
  const [nomeEdit, setNomeEdit] = useState('');

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pecaStatusSelecionada, setPecaStatusSelecionada] = useState<any>(null);

  const [busca, setBusca] = useState('');

  // 🔥 EDITAR (SEM REQUISIÇÃO DESNECESSÁRIA)
  const editarPecas = (item: any) => {
    setPecaSelecionada(item);
    setNomeEdit(item.nome);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!nomeEdit.trim()) return;

    try {
      await api.put(`/pecas/atualizar/${pecaSelecionada.id}`, {
        nome: nomeEdit,
      });

      setPecas(prev =>
        prev.map(p =>
          p.id === pecaSelecionada.id ? { ...p, nome: nomeEdit } : p
        )
      );

      setModalVisible(false);
      setPecaSelecionada(null);
      setNomeEdit('');
    } catch (error) {
      console.error('Erro ao editar peça:', error);
    }
  };

  const atualizarStatus = async (id: string, ativo: boolean) => {
    try {
      await api.patch(`/pecas/atualizarStatus/${id}`, {
        ativo: !ativo,
      });

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

  const pecasFiltradas = pecas.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
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

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#777" />

          <TextInput
            placeholder="Buscar peça..."
            placeholderTextColor="#777"
            value={busca}
            onChangeText={setBusca}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={pecasFiltradas}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma peça cadastrada</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>{item.nome}</Text>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {/* EDITAR */}
                <TouchableOpacity
                  onPress={() => editarPecas(item)}
                  style={styles.statusButton}
                >
                  <MaterialIcons name="edit" size={22} color="#fff" />
                </TouchableOpacity>

                {/* STATUS */}
                <TouchableOpacity
                  onPress={() => atualizarStatus(item.id, item.ativo)}
                  style={styles.statusButton}
                >
                  <Animated.View
                    style={{ transform: [{ scale: scaleAnim }] }}
                  >
                    <MaterialIcons
                      name={item.ativo ? 'toggle-on' : 'toggle-off'}
                      size={36}
                      color={item.ativo ? '#22C55E' : '#EF4444'}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Peça</Text>

            <TextInput
              autoFocus
              value={nomeEdit}
              onChangeText={setNomeEdit}
              style={styles.input}
              placeholder="Nome da peça"
              placeholderTextColor="#777"
            />

            <TouchableOpacity style={styles.button} onPress={salvarEdicao}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.button, { backgroundColor: '#EF4444' }]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 10,
  },
  
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
  },
  statusButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
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
    marginBottom: 10,
  },
  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 12,
  },
});
