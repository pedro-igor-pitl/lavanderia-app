import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useApp } from '../../components/AppContext';
import api from '../services/api';
import { useRouter } from 'expo-router';

export default function Coleta() {
  const [modoManual, setModoManual] = useState(false);
  const router = useRouter();
  const [clientes, setClientes] = useState<any[]>([]);

  const carregarCliente = async () => {
    try {
      const { data } = await api.get('/cliente/listarClientesResumido?ativo=true');
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar clientes');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nova Coleta</Text>

      {/* ESCOLHA */}
      {!modoManual && (
        <>
          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              setModoManual(true);
              await carregarCliente();
            }}
          >
            <Text style={styles.text}>✍️ Cadastro Manual</Text>
          </TouchableOpacity>
        </>
      )}

      {/* MANUAL */}
      {modoManual && (
        <>
          <Text style={styles.label}>Selecionar Cliente</Text>

          {clientes.length === 0 && (
            <Text style={{ color: '#777' }}>
              Nenhum cliente cadastrado
            </Text>
          )}

          {clientes.map((c: any) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.card,
              ]}
              onPress={() => {
                router.push(`/cadastrar-coleta/${c.id}`);
              }}
            >
              <Text style={styles.text}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
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