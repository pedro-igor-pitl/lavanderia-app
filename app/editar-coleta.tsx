import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import api from './services/api';
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function VizualizarColeta() {
    const params = useLocalSearchParams();

    const [form, setForm] = useState<any>(null);

    const clienteId = Array.isArray(params.clienteId)
    ? params.clienteId[0]
    : params.clienteId;

    const rollId = Array.isArray(params.rollId)
      ? params.rollId[0]
      : params.rollId;

    const [coleta, setColeta] = useState<any>(null);

    const tipo = Number(form?.peso) > 0 ? 'PESO' : 'PECA';

    const router = useRouter();

    useEffect(() => {
      if (!clienteId || !rollId) return;

      const carregar = async () => {
        try {
          const { data } = await api.get('/coleta/visualizarColetaPorRoll', {
            params: {
              clienteId,
              rollId,
            },
          });

          console.log('Dados', data);

          setForm(data);
          setColeta(data);

        } catch (error: any) {
          console.log('ERRO:', error?.response?.data || error);
          Alert.alert('Erro', 'Não foi possível carregar a coleta');
        }
      };

      carregar();
    }, [clienteId, rollId]);

    const calcularTotal = (item: any) => {
      const quantidade = Number(item.quantidade || 0);
      const preco = Number(item.precoUnitario || item.preco_unitario || 0);

      return (quantidade * preco).toFixed(2);
    };

    const calcularQuantidadeTotal = () => {
      if (!form?.itens) return 0;

      return form.itens.reduce((total: number, item: any) => {
        return total + Number(item.quantidade || 0);
      }, 0);
    };

    const calcularValorTotal = () => {
      if (!form?.itens) return 0;

      return form.itens.reduce((total: number, item: any) => {
        const quantidade = Number(item.quantidade || 0);
        const preco = Number(item.precoUnitario || 0);

        return total + quantidade * preco;
      }, 0);
    };

    const calcularTotalPeso = () => {
      const peso = Number(form?.peso ?? 0);

      const valorKg = Number(
        form?.valorKg ?? form?.valor_kg ?? form?.valorPorKg ?? 0
      );

      if (peso <= 0 || valorKg <= 0) return '0.00';

      return (peso * valorKg).toFixed(2);
    };

    const removerItem = (pecaId: string) => {
      console.log('REMOVENDO:', pecaId);

      setForm((prev: any) => {
        console.log('ANTES:', prev.itens);

        const novosItens = prev.itens.filter(
          (item: any) => (item.pecaId || item.peca_id) !== pecaId
        );

        console.log('DEPOIS:', novosItens);

        return {
          ...prev,
          itens: novosItens,
        };
      });
    };

    const AdicionarNovaPeca = async () => {
      try {
        const {data} = await api.get(`/cliente/buscarClienteCompleto/${clienteId}`);

        console.log(data);
      } catch (error: any) {
        console.log('ERRO:', error?.response?.data || error);
        Alert.alert('Erro', 'Não foi possível carregar a coleta');
      }
    }

    const salvarEdicao = async () => {
      console.log('CLICOU NO SALVAR');
      try {
        const payload = {
          id: rollId,
          codigo_manual: form.codigoManual,
          data_coleta: form.dataColeta,
          cliente_id: clienteId,
          peso: Number(form.peso),
          itens: form.itens?.map((item: any) => ({
            peca_id: item.pecaId,
            quantidade: Number(item.quantidade),
            preco_unitario: Number(item.precoUnitario),
          })),
        };

        console.log('ENVIANDO:', payload);
        console.log('ID SENDO ENVIADO:', form.id);

        await api.put('/coleta/atualizarColetaPorRoll', payload);

        Alert.alert('Sucesso', 'Coleta atualizada!');
        router.push('/coleta');
      } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Não foi possível salvar');
      }
    };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Editar Coleta</Text>

      {/* Dados do Roll */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>

          {/* Cliente */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Cliente</Text>
            <View style={[styles.input, styles.inputDisabledDark]}>
              <Text style={{ color: '#fff' }}>
                {coleta?.clienteNome || ''}
              </Text>
            </View>
          </View>

          {/* Número do Roll */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Nº Roll</Text>
              <TextInput
                style={styles.input}
                value={form?.codigoManual?.toString() || ''}
                onChangeText={(text) =>
                  setForm((prev: any) => ({
                    ...prev,
                    codigoManual: text,
                  }))
                }
              />
          </View>

          {/* Data */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Data</Text>

            <TextInput
              style={styles.input}
              value={form?.dataColeta || ''}
              placeholder="01/01/2026"
              placeholderTextColor="#777"
              onChangeText={(text) =>
                setForm((prev: any) => ({
                  ...prev,
                  dataColeta: text,
                }))
              }
            />
          </View>

        </View>
      </View>

      {/* Peso */}
      {tipo === 'PESO' && (
        <View style={styles.card}>
          <View style={styles.rowBetween}>

            {/* Peso */}
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Peso (kg)</Text>

              <TextInput
                style={styles.input}
                value={form?.peso?.toString() || ''}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setForm((prev: any) => ({
                    ...prev,
                    peso: text,
                  }))
                }
              />
            </View>

            {/* Preço Unitário */}
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Preço Unitário</Text>

              <TextInput
                style={styles.input}
                value={
                  (form?.valorKg ??
                    form?.valor_kg ??
                    form?.valorPorKg ??
                    '').toString()
                }
                keyboardType="numeric"
                onChangeText={(text) =>
                  setForm((prev: any) => ({
                    ...prev,
                    valorKg: text,
                  }))
                }
              />
            </View>

            {/* Total */}
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Total</Text>

              <View style={[styles.input, styles.inputDisabledDark]}>
                <Text style={{ color: '#009b1a' }}>
                  R$ {calcularTotalPeso()}
                </Text>
              </View>
            </View>

          </View>
        </View>
      )}

      {/* Peças */}
      {tipo === 'PECA' && (
        <View style={styles.card}>
          {form?.itens?.map((item: any, index: number) => (
            <View key={item.pecaId} style={styles.pecaItem}>
              <TouchableOpacity
                onPress={() => removerItem(item.pecaId)}
                style={styles.botaoRemover}
              >
                <Text style={styles.textoRemover}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.pecaNome}>{item.nomePeca}</Text>

              <View style={styles.rowBetween}>

                {/* Quantidade */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.pecaNome}>Quantidade</Text>

                  <TextInput
                    style={styles.input}
                    value={item.quantidade?.toString() || ''}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const novosItens = [...form.itens];
                      novosItens[index].quantidade = text;

                      setForm((prev: any) => ({
                        ...prev,
                        itens: novosItens,
                      }));
                    }}
                  />
                </View>

                {/* Preço Unitário */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.pecaNome}>Preço Unitário</Text>

                  <View style={[styles.input, styles.inputDisabledDark]}>
                    <Text style={{ color: '#fff' }}>
                      {item.precoUnitario}
                    </Text>
                  </View>
                </View>

                {/* Total */}
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.pecaNome}>Total</Text>

                  <View style={[styles.input, styles.inputDisabledDark]}>
                    <Text style={{ color: '#009b1a' }}>
                      R$ {calcularTotal(item)}
                    </Text>
                  </View>
                </View>

              </View>
            </View>
          ))}
          <View style={{ flex: 1}}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#32553f', marginTop: 10 }]}
                onPress={() => {
                  AdicionarNovaPeca();
                }}
              >
                <Text style={styles.buttonText}>+ Adicionar Peça</Text>
              </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.rowBetween}>

          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.pecaNome}>Quantidade Total de Peças</Text>
            <View style={[styles.input, styles.inputDisabledDark]}>
              <Text style={{ color: '#d6d6d6' }}>
                {calcularQuantidadeTotal()}
              </Text>
            </View>
          </View>

          {/* Data */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.pecaNome}>Valor Total</Text>
            <View style={[styles.input, styles.inputDisabledDark]}>
              <Text style={{ color: '#009b1a' }}>
                R$ {calcularValorTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

        <TouchableOpacity 
            style={styles.button}             
            onPress={salvarEdicao}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    botaoRemover: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4d4f',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  textoRemover: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  inputDisabledDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#2a2a2a',
    color: '#888',
    opacity: 0.7,
  },
  numeroDataRollEntre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelClienteInformativo: {
    fontSize: 15,
    color: '#bbbbbb',
    marginBottom: 20,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    padding: 16,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2f3640',
  },

  label: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },

  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
    color: 'white',
  },

  card: {
    backgroundColor: 'rgba(28,28,30,1.00)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },

  pecaItem: {
    marginBottom: 12,
    position: 'relative',
  },

  pecaNome: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 10,
    fontWeight: '500',
  },
});