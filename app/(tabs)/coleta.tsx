import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState, useRef } from 'react';
import api from '../services/api';
import { useRouter } from 'expo-router';
import { Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useMemo } from 'react';
import { Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Coleta() {
  const [modo, setModo] = useState<'menu' | 'manual' | 'visualizar'>('menu');
  const [acao, setAcao] = useState<'visualizar' | 'editar'>('visualizar');

  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [coletas, setColetas] = useState<any[]>([]);

  const [search, setSearch] = useState('');

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };


  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) =>
      (c.nome ?? '').toLowerCase().includes(search.toLowerCase())
    );
  }, [clientes, search]);

  const carregarCliente = async () => {
    try {
      const { data } = await api.get('/cliente/listarClientesResumido?ativo=true');
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar clientes');
    }
  };

  const formatarDataParaBackend = (data: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!regex.test(data)) {
      throw new Error('Data inválida');
    }

    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const buscarColetas = async () => {
    try {
      if (!dataInicio || !dataFim) {
        Alert.alert('Erro', 'Preencha as datas');
        return;
      }

      const inicio = formatarDataParaBackend(dataInicio);
      const fim = formatarDataParaBackend(dataFim);

      const response = await api.get('/coleta/vizualizarColetas', {
        params: {
          clienteId: clienteSelecionado,
          inicio,
          fim,
        },
      });

      if (response.data.length === 0) {
        Alert.alert('Aviso', 'Nenhuma coleta encontrada');
        return;
      }

      setColetas(response.data);
      setModalVisivel(false);

    } catch (error) {
      Alert.alert('Erro', 'Data inválida ou erro na busca');
      console.error(error);
    }
  };

  const resetarBusca = () => {
    setColetas([]);
    setClienteSelecionado(null);
    setDataInicio('');
    setDataFim('');
  };

  const atualizarStatus = async (id: string, ativo: boolean) => {
    try {
      const novoStatus = !ativo;

      await api.patch(`/coleta/atualizarStatus/${id}`, {
        ativo: novoStatus,
      });

      setColetas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ativo: novoStatus } : c
        )
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar status');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Coleta</Text>

      {/* ESCOLHA */}
      {modo === 'menu' && (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              setModo('manual');
              await carregarCliente();
            }}
          >
            <Text style={styles.text}>✍️ Cadastro Manual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              resetarBusca();
              setModo('visualizar');
              setAcao('visualizar');
              await carregarCliente();
            }}
          >
            <Text style={styles.text}>📄 Visualizar uma Coleta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              resetarBusca();
              setModo('visualizar');
              setAcao('editar');
              await carregarCliente();
            }}
          >
            <Text style={styles.text}>📝 Editar uma Coleta</Text>
          </TouchableOpacity>

        </>
      )}

      {/* MANUAL */}
      {modo === 'manual' && (
        <>
          <Text style={styles.label}>Selecionar Cliente</Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar cliente..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {clientes.length === 0 && (
            <Text style={{ color: '#777' }}>
              Nenhum cliente cadastrado
            </Text>
          )}

          {clientesFiltrados.map((c: any) => (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              onPress={() => router.push(`/cadastrar-coleta/${c.id}`)}
            >
              <Text style={styles.text}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {modo === 'visualizar' && (
        <>
          <Text style={styles.label}>Selecionar Cliente</Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar cliente..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {clientes.length === 0 && (
            <Text style={{ color: '#777' }}>
              Nenhum cliente cadastrado
            </Text>
          )}

          {clientesFiltrados.map((c: any) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.card,
              ]}
              onPress={() => {
                setClienteSelecionado(c.id);
                setModalVisivel(true);
              }}
            >
              <Text style={styles.text}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {modo === 'editar' && (
        <>
          <Text style={styles.label}>Selecionar Cliente</Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar cliente..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
          />

          {clientesFiltrados.map((c: any) => (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              onPress={() => {
                setClienteSelecionado(c.id);
                setModalVisivel(true);
              }}
            >
              <Text style={styles.text}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <BlurView intensity={80} style={styles.blurContainer}>
          
          <View style={styles.modalBox}>

            {/* botão fechar */}
            <TouchableOpacity
              onPress={() => {
                setModalVisivel(false);
                setDataInicio('');
                setDataFim('');
              }}
              style={styles.closeButton}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Data Início</Text>
            <TextInput
              style={styles.input}
              placeholder="01/01/2026"
              placeholderTextColor="#777"
              value={dataInicio}
              onChangeText={setDataInicio}
            />

            <Text style={styles.label}>Data Fim</Text>
            <TextInput
              style={styles.input}
              placeholder="01/01/2026"
              placeholderTextColor="#777"
              value={dataFim}
              onChangeText={setDataFim}
            />

            <TouchableOpacity style={styles.button} onPress={buscarColetas}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>

          </View>

        </BlurView>
      </Modal>

      {coletas.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Coletas Encontradas</Text>

          {coletas.map((c: any) => (
            <View key={c.id} style={styles.card}>
              <Text style={styles.text}>Cliente: {c.clienteNome}</Text>
              <Text style={styles.text}>Roll: {c.codigoManual}</Text>
              <Text style={styles.text}>Data: {c.dataColeta}</Text>
              <TouchableOpacity
                onPress={() => {
                  animateToggle();
                  atualizarStatus(c.id, c.ativo);
                  }}
                style={styles.statusButton}
                activeOpacity={0.7}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <MaterialIcons
                    name={c.ativo ? 'toggle-on' : 'toggle-off'}
                    size={40}
                    color={c.ativo ? '#22C55E' : '#EF4444'}
                  />
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => {
                  if (acao === 'visualizar') {
                    router.push({
                      pathname: '/vizualizar-coleta',
                      params: {
                        clienteId: c.clienteId,
                        rollId: c.id,
                      },
                    });
                  } else {
                    router.push({
                      pathname: '/editar-coleta',
                      params: {
                        clienteId: c.clienteId,
                        rollId: c.id,
                      },
                    });
                  }
                }}
              >
                <Text style={styles.buttonText}>
                  {acao === 'visualizar' ? '👁 Ver Detalhes' : '✏️ Editar'}
                </Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>
      )}
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  statusButton: {
    padding: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalBox: {
    width: '90%',
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 14,
  },

  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
  },
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
  cardSelected: {
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    color: '#aaa',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
  },
  inputSmall: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    width: 80,
    marginTop: 10,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});