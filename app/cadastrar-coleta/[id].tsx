import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import api from '../services/api';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CadastrarColeta() {
  const params = useLocalSearchParams();

  const clienteId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [cliente, setCliente] = useState<any>(null);
  const [tipo, setTipo] = useState<'peso' | 'peca' | null>(null);

  const [numeroRoll, setNumeroRoll] = useState('');
  const [dataRoll, setDataRoll] = useState('');

  const [peso, setPeso] = useState('');
  const [quantidades, setQuantidades] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!clienteId) return;

    const carregar = async () => {
      try {
        const { data } = await api.get(
          `/cliente/buscarClienteCompleto/${clienteId}`
        );

        setCliente(data);
        setTipo(data.tipoCliente);

        console.log('Dados de CLiente completo:', data.pecas[0].precoCliente);

      } catch (error) {
        console.error('Erro:', error);
      }
    };

    carregar();
  }, [clienteId]);

  const handleQuantidadeChange = (pecaId: string, valor: string) => {
    setQuantidades((prev) => ({
      ...prev,
      [pecaId]: valor,
    }));
  };

  const calcularTotal = (peca: any) => {
    const quantidade = Number(quantidades[peca.pecaId] || 0);
    const preco = Number(peca.precoCliente || 0);

    const total = quantidade * preco;

    return total.toFixed(2);
  };

  const formatarData = (valor: string) => {
    let v = valor.replace(/\D/g, '');

    // aplica máscara
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);

    return v;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Coleta</Text>

      {/* Cliente */}
      <View style={styles.card}>
        <Text style={styles.label}>Cliente</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={cliente?.nome || ''}
          editable={false}
        />
      </View>

      {/* Dados do Roll */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>

          {/* Número do Roll */}
          <View style={{ flex: 2, marginRight: 8 }}>
            <Text style={styles.label}>Número do Roll</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 12345"
              placeholderTextColor="#777"
              value={numeroRoll}
              onChangeText={setNumeroRoll}
            />
          </View>

          {/* Data */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#777"
              value={dataRoll}
              onChangeText={(text) => setDataRoll(formatarData(text))}
              maxLength={10}
            />
          </View>

        </View>
      </View>

      {/* Peso */}
      {tipo === 'PESO' && (
        <View style={styles.card}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Peças */}
      {tipo === 'PECA' && (
        <View style={styles.card}>
          {cliente?.pecas?.map((peca: any) => (
            <View key={peca.pecaId} style={styles.pecaItem}>
              <Text style={styles.pecaNome}>{peca.nome}</Text>

              <View style={styles.rowBetween}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.pecaNome}>Quantidade</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={quantidades[peca.pecaId] || ''}
                    onChangeText={(valor) =>
                      handleQuantidadeChange(peca.pecaId, valor)
                    }
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.pecaNome}>Total</Text>
                    <View style={[styles.input, styles.inputDisabledDark]}>
                      <Text style={{ color: '#009b1a' }}>
                        R$ {calcularTotal(peca)}
                      </Text>
                    </View>
                </View>
              </View>

            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

  inputDisabled: {
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
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