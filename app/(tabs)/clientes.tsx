import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Animated } from 'react-native';
import { Modal } from 'react-native';

export default function Clientes() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [clientesResumido, setClientesResumido] = useState<any[]>([]);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  useEffect(() => {
    async function carregarClientesResumido() {
      try {
        const response = await api.get('/cliente/listarClientesResumido');
          setClientesResumido(response.data);
          console.log('Dados de clientes resumidos:', response.data);
      } catch (error) {
          console.log('Erro ao buscar peças:', error);
      }
    }

    carregarClientesResumido();
  }, []);

  const abrirModalCliente = async (id: string) => {
    try {
      const response = await api.get(
        `/cliente/buscarClienteCompleto/${id}`
      );

      setClienteSelecionado(response.data);
      setModalVisible(true);

    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      Alert.alert('Erro', 'Não foi possível carregar o cliente');
    }
  };

  const atualizarStatusCliente = async (id: string, ativo: boolean) => {
    try {
      await api.patch(`/cliente/atualizarStatus/${id}`, {
        ativo: !ativo,
      });

      setClientesResumido(prev => 
        prev.map(p =>
          p.id === id ? { ...p, ativo: !p.ativo } : p
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const ClientesFiltradas = clientesResumido.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarTelefone = (telefone: string) => {
    const t = telefone.replace(/\D/g, '');

    if (t.length === 11) {
      return t.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    if (t.length === 10) {
      return t.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return telefone;
  };

  const formatarTipo = (tipo: string) => {
    if (tipo === 'PECA') return 'Peça';
    if (tipo === 'PESO') return 'Peso';
    return tipo;
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Clientes</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cadastro-cliente')}
      >
        <Text style={styles.buttonText}>
          + Novo Cliente
        </Text>
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
        data={ClientesFiltradas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum cliente cadastrado</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            <Text style={styles.text}>{item.nome}</Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>

              {/* EDITAR */}
              <TouchableOpacity
                onPress={() => router.push(`/editar-cliente/${item.id}`)}
                style={styles.statusButton}
              >
                <MaterialIcons name="edit" size={22} color="#fff" />
              </TouchableOpacity>

              {/* STATUS */}
              <TouchableOpacity
                onPress={() => atualizarStatusCliente(item.id, item.ativo)}
                style={styles.statusButton}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <MaterialIcons
                    name={item.ativo ? 'toggle-on' : 'toggle-off'}
                    size={36}
                    color={item.ativo ? '#22C55E' : '#EF4444'}
                  />
                </Animated.View>
              </TouchableOpacity>

              {/* 👁 VISUALIZAR */}
              <TouchableOpacity
                onPress={() => abrirModalCliente(item.id)}
                style={styles.statusButton}
              >
                <MaterialIcons name="visibility" size={22} color="#fff" />
              </TouchableOpacity>

            </View>
          </View>
        )}
      />


    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <Text style={styles.modalTitle}>Detalhes do Cliente</Text>

          {clienteSelecionado && (
            <>
              <Text style={styles.modalText}>
                Nome: {clienteSelecionado.nome}
              </Text>

              <Text style={styles.modalText}>
                Email: {clienteSelecionado.email || 'Não informado'}
              </Text>

              <Text style={styles.modalText}>
                Telefone: {formatarTelefone(clienteSelecionado.telefone)}
              </Text>

              <Text style={styles.modalText}>
                Tipo: {formatarTipo(clienteSelecionado.tipoCliente)}
              </Text>

              {clienteSelecionado.tipoCliente === 'PESO' && (
                <Text style={[styles.modalText, { color: '#22C55E', fontWeight: 'bold' }]}>
                  Valor por Kg: R$ {clienteSelecionado.valorKg ?? 0}
                </Text>
              )}

              {clienteSelecionado.tipoCliente === 'PECA' && (
                <>
                  <Text style={[styles.modalText, { marginTop: 10 }]}>
                    Peças:
                  </Text>

                  {clienteSelecionado.pecas?.map((p: any) => (
                    <View key={p.pecaId} style={styles.pecaBox}>
                      <Text style={styles.modalText}>
                        • {p.nome}
                      </Text>

                      <Text
                        style={[
                          styles.modalText,
                          {
                            color: '#22C55E',
                            fontWeight: 'bold',
                          },
                        ]}
                      >
                        R$ {Number(p.precoCliente).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
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
    width: '80%',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },

  modalText: {
    color: '#aaa',
    marginBottom: 5,
  },
  statusButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
  },

  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
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
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});