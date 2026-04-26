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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

export default function VizualizarColeta() {
  const params = useLocalSearchParams();

    const clienteId = Array.isArray(params.clienteId)
    ? params.clienteId[0]
    : params.clienteId;

    const codigoManual = Array.isArray(params.codigoManual)
    ? params.codigoManual[0]
    : params.codigoManual;

    const [coleta, setColeta] = useState<any>(null);

    const tipo = coleta?.peso ? 'PESO' : 'PECA';

  const router = useRouter();

    useEffect(() => {
    if (!clienteId || !codigoManual) return;

    const carregar = async () => {
        try {
          const { data } = await api.get('/coleta/vizualizarColetaPorRoll', {
            params: {
              clienteId,
              codigoManual,
            },
          });

        console.log('peso:', coleta?.peso);
        console.log('valorKg:', coleta?.valorKg);

        console.log('Dados', data);

          setColeta(data);

        } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a coleta');
        }
    };

    carregar();
    }, [clienteId, codigoManual]);

    const calcularTotal = (item: any) => {
      const quantidade = Number(item.quantidade || 0);
      const preco = Number(item.precoUnitario || item.preco_unitario || 0);

      return (quantidade * preco).toFixed(2);
    };

    const calcularQuantidadeTotal = () => {
      if (!coleta?.itens) return 0;

      return coleta.itens.reduce((total: number, item: any) => {
        return total + Number(item.quantidade || 0);
      }, 0);
    };

    const calcularValorTotal = () => {
      if (!coleta?.itens) return 0;

      return coleta.itens.reduce((total: number, item: any) => {
        const quantidade = Number(item.quantidade || 0);
        const preco = Number(item.precoUnitario || 0);

        return total + quantidade * preco;
      }, 0);
    };

    const calcularTotalPeso = () => {
      const peso = Number(coleta?.peso ?? 0);

      const valorKg =
        Number(coleta?.valorKg ?? coleta?.valor_kg ?? coleta?.valorPorKg ?? 0);

      if (peso <= 0 || valorKg <= 0) return '0.00';

      return (peso * valorKg).toFixed(2);
    };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Vizualizar Coleta</Text>

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
            <View style={[styles.input, styles.inputDisabledDark]}>
              <Text style={{ color: '#fff' }}>
                {coleta?.codigoManual || ''}
              </Text>
            </View>
          </View>

          {/* Data */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Data</Text>
            <View style={[styles.input, styles.inputDisabledDark]}>
              <Text style={{ color: '#fff' }}>
                {coleta?.dataColeta || ''}
              </Text>
            </View>
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
              <View style={[styles.input, styles.inputDisabledDark]}>
                <Text style={{ color: '#fff' }}>
                  {coleta?.peso?.toString() || ''}
                </Text>
              </View>
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
          {coleta?.itens?.map((item: any) => (
            <View key={item.pecaId} style={styles.pecaItem}>
              <Text style={styles.pecaNome}>{item.nome}</Text>

              <View style={styles.rowBetween}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.pecaNome}>Quantidade</Text>
                    <View style={[styles.input, styles.inputDisabledDark]}>
                      <Text style={{ color: '#fff' }}>
                        {item.quantidade}
                      </Text>
                    </View>
                </View>

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
            onPress={() => {
              SalvarNovaColeta();
              router.push('/coleta');
            }}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

      </View>

        
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  },

  pecaNome: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 10,
    fontWeight: '500',
  },
});