import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../components/AppContext';

export default function CadastroPeriodo() {
  const { adicionarPeriodo, periodos } = useApp();
  const router = useRouter();

  const [nome, setNome] = useState('');

  // 🔹 Função para gerar ID limpo
  const gerarId = (texto: string) => {
    return texto
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // espaço -> hífen
      .normalize('NFD') // remove acento
      .replace(/[\u0300-\u036f]/g, '');
  };

  const salvar = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite o nome do período');
      return;
    }

    const id = gerarId(nome);

    // 🔒 Evitar duplicado
    const existe = periodos.find((p) => p.id === id);

    if (existe) {
      Alert.alert('Erro', 'Esse período já existe');
      return;
    }

    adicionarPeriodo({
      id,
      nome: nome.trim(),
    });

    Alert.alert('Sucesso', 'Período cadastrado!');
    setNome('');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Período</Text>

      <Text style={styles.label}>Nome do período *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Semanal"
        placeholderTextColor="#777"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
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
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
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