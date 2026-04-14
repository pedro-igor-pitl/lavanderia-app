import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';

export default function CadastroCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'peso' | 'peca' | ''>('');
  const [peca, setPeca] = useState('');

  const salvar = () => {
    if (!nome || !telefone || !tipo) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
      return;
    }

    Alert.alert('Sucesso', 'Cliente cadastrado!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Cliente</Text>

      {/* Nome */}
      <Text style={styles.label}>Nome *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        placeholderTextColor="#777"
        value={nome}
        onChangeText={setNome}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
      />

      {/* Telefone */}
      <Text style={styles.label}>Telefone *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o telefone"
        placeholderTextColor="#777"
        value={telefone}
        onChangeText={setTelefone}
      />

      {/* Tipo */}
      <Text style={styles.label}>Tipo de Cliente *</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.radio,
            tipo === 'peso' && styles.radioActive,
          ]}
          onPress={() => setTipo('peso')}
        >
          <Text style={styles.radioText}>Peso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.radio,
            tipo === 'peca' && styles.radioActive,
          ]}
          onPress={() => setTipo('peca')}
        >
          <Text style={styles.radioText}>Peça</Text>
        </TouchableOpacity>
      </View>

      {/* Se for peça */}
      {tipo === 'peca' && (
        <>
          <Text style={styles.label}>Peça vinculada</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Camisa"
            placeholderTextColor="#777"
            value={peca}
            onChangeText={setPeca}
          />
        </>
      )}

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Cliente</Text>
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
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  radio: {
    flex: 1,
    padding: 14,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    alignItems: 'center',
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
});