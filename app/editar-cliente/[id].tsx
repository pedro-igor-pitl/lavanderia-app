import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { useApp } from '../components/AppContext';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import api from '../../app/services/api';
import { useLocalSearchParams } from 'expo-router';

export default function EditarCliente() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'peso' | 'peca' | ''>('');
  const [pecasSelecionadas, setPecasSelecionadas] = useState<any[]>([]);
  const [valorKg, setValorKg] = useState('');
  const [pecas, setPecas] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    async function carregarCliente() {
      try {
        const { data } = await api.get(`/cliente/buscarClienteCompleto/${id}`);

        console.log('Cliente carregado:', data);

        setNome(data.nome);
        setEmail(data.email);
        setTelefone(data.telefone);

        setTipo(data.tipoCliente.toLowerCase());

        if (data.tipoCliente === 'PESO') {
          setValorKg(String(data.valorKg * 100));
        }

        if (data.tipoCliente === 'PECA') {
          const pecasFormatadas = data.pecas.map((p: any) => ({
            id: p.pecaId,
            nome: p.nome,
            precoCliente: String(p.precoCliente * 100),
          }));

          setPecasSelecionadas(pecasFormatadas);
        }

      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
      }
    }

    carregarCliente();
  }, [id]);

  const togglePeca = (item: any) => {
    const existe = pecasSelecionadas.find(p => p.id === item.id);

    if (existe) {
      setPecasSelecionadas(prev => prev.filter(p => p.id !== item.id));
    } else {
      setPecasSelecionadas(prev => [
        ...prev,
        { ...item, precoCliente: '' },
      ]);
    }
  };

  const atualizarPreco = (id: string, valor: string) => {
    setPecasSelecionadas(prev =>
      prev.map(p =>
        p.id === id ? { ...p, precoCliente: valor } : p
      )
    );
  };

  const formatarMoeda = (valor: string) => {
    const numero = Number(valor) / 100;

    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const salvar = async () => {
    if (
      !nome ||
      !telefone ||
      !tipo ||
      (tipo === 'peso' && !valorKg) ||
      (tipo === 'peca' &&
        (pecasSelecionadas.length === 0 ||
          pecasSelecionadas.some(p => !p.precoCliente)))
    ) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      let payload: any = {
        nome,
        email,
        telefone,
        tipoCliente: tipo.toUpperCase()
      };

      if (tipo === 'peca') {
        payload.pecas = pecasSelecionadas.map(p => ({
          pecaId: p.id,
          precoCliente: Number(p.precoCliente) / 100,
        }));

        payload.valorKg = null;
      }

      if (tipo === 'peso') {
        payload.valorKg = Number(valorKg) / 100;
        payload.pecas = null;
      }

      console.log('Payload enviado:', payload);

      await api.put(`/cliente/atualizarCliente/${id}`, payload);

      Alert.alert('Sucesso', 'Cliente atualizado!');
      router.back();

    } catch (error: any) {
        console.error(error);

        const mensagem =
            error?.response?.data?.message ||
            'Erro ao atualizar cliente';

        Alert.alert('Erro', mensagem);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalHeader}>
          <Text style={styles.title}>Selecionar Peças</Text>

          <TouchableOpacity
            style={styles.closeContainer}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.modalContainer, { paddingTop: 0 }]}>

          <ScrollView>
            {pecas.map((item) => {
              const selecionada = pecasSelecionadas.find(p => p.id === item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemLista,
                    selecionada && styles.itemSelecionado
                  ]}
                  onPress={() => togglePeca(item)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.itemTexto}>{item.nome}</Text>

                  <View style={styles.checkBox}>
                    {selecionada && <Text style={styles.check}>✔</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* TELA PRINCIPAL */}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Editar  Cliente</Text>

        <Text style={styles.label}>Nome *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={styles.label}>Telefone *</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

        {/* Tipo */}
        <Text style={styles.label}>Tipo de Cliente *</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.radio, tipo === 'peso' && styles.radioActive]}
            onPress={() => {
              setTipo('peso');
              setPecasSelecionadas([]);
            }}
          >
            <Text style={styles.radioText}>Peso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radio, tipo === 'peca' && styles.radioActive]}
            onPress={() => {
              setTipo('peca');
              setValorKg('');
            }}
          >
            <Text style={styles.radioText}>Peça</Text>
          </TouchableOpacity>
        </View>

        {/* PESO */}
        {tipo === 'peso' && (
          <>
            <Text style={styles.label}>Valor por Kg *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formatarMoeda(valorKg || '0')}
              onChangeText={(value) => {
                const somenteNumeros = value.replace(/\D/g, '');
                setValorKg(somenteNumeros);
              }}
            />
          </>
        )}

        {/* PEÇAS */}
        {tipo === 'peca' && (
          <>
            <Text style={styles.label}>Peças *</Text>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.selectText}>
                {pecasSelecionadas.length > 0
                  ? `${pecasSelecionadas.length} selecionadas`
                  : 'Selecionar peças'}
              </Text>
            </TouchableOpacity>

            {pecasSelecionadas.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nomePeca}>{item.nome}</Text>
                  <Text style={styles.subText}>Defina o valor do Kg</Text>
                </View>

                <View style={styles.precoContainer}>
                  <Text style={styles.moeda}>R$</Text>

                  <TextInput
                    style={styles.inputPreco}
                    keyboardType="numeric"
                    value={formatarMoeda(item.precoCliente || '0').replace('R$', '')}
                    onChangeText={(value) => {
                      const somenteNumeros = value.replace(/\D/g, '');
                      atualizarPreco(item.id, somenteNumeros);
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={styles.botaoRemover}
                  onPress={() =>
                    setPecasSelecionadas(prev =>
                      prev.filter(p => p.id !== item.id)
                    )
                  }
                >
                  <Text style={styles.textRemover}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>Atualizar  Cliente</Text>
        </TouchableOpacity>
      </ScrollView>
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
  label: {
    color: '#aaa',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
  },
  inputSmall: {
    backgroundColor: '#303030',
    color: '#119400',
    padding: 10,
    borderRadius: 8,
    width: 80,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radio: {
    padding: 14,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
  },
  radioActive: {
    backgroundColor: '#2563EB',
  },
  radioText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#2A2A2C',
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  text: {
    color: '#fff',
  },
  addText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  nomePeca: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  subText: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },

  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  moeda: {
    color: '#00FF88',
    fontWeight: '600',
    marginRight: 4,
  },

  inputPreco: {
    color: '#00FF88',
    minWidth: 60,
    fontWeight: '600',
  },

  botaoRemover: {
    backgroundColor: '#2A2A2C',
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textRemover: {
    color: '#FF4D4D',
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#1C1C1E',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2A2A2C',
  },

  selectText: {
    color: '#aaa',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    padding: 20,
  },

  itemLista: {
    backgroundColor: '#1A1A1D',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2C',
  },

  itemSelecionado: {
    borderColor: '#2563EB',
    backgroundColor: '#1E293B',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  itemTexto: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 15,
  },

  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  check: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeContainer: {
    backgroundColor: '#1F1F22',
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2C',
  },

  closeButton: {
    color: '#FF4D4D',
    fontSize: 18,
    fontWeight: '700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#0F0F0F',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F22',
  },
});