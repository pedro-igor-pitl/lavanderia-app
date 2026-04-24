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

        console.log('Dados de CLiente completo:', data.tipoCliente);

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
        <Text style={styles.label}>Número do Roll</Text>
        <TextInput
          style={styles.input}
          value={numeroRoll}
          onChangeText={setNumeroRoll}
        />

        <Text style={styles.label}>Data do Roll</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={dataRoll}
          onChangeText={setDataRoll}
        />
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
          <Text style={styles.labelClienteInformativo}>Defina a quantidade por peça para {cliente.nome}</Text>
          {cliente?.pecas?.map((peca: any) => (
            <View key={peca.id} style={styles.pecaItem}>
              <Text style={styles.pecaNome}>{peca.nome}</Text>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Quantidade"
                value={quantidades[peca.id] || ''}
                onChangeText={(valor) =>
                  handleQuantidadeChange(peca.id, valor)
                }
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  labelClienteInformativo: {
    fontSize: 18,
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
    marginBottom: 4,
    fontWeight: '500',
  },
});