import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useApp } from '../components/AppContext';
import { useRouter } from 'expo-router';

export default function CadastroCliente() {
  const { pecas = [] } = useApp();

  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'peso' | 'peca' | ''>('');
  const [pecasSelecionadas, setPecasSelecionadas] = useState<any[]>([]);
  const [valorKg, setValorKg] = useState('');
  const [periodo, setPeriodo] = useState<'diario' | 'quinzenal' | 'mensal' | ''>('');

  const togglePeca = (item: any) => {
    const existe = pecasSelecionadas.find(p => p.id === item.id);

    if (existe) {
      setPecasSelecionadas(
        pecasSelecionadas.filter(p => p.id !== item.id)
      );
    } else {
      setPecasSelecionadas([...pecasSelecionadas, item]);
    }
  };

    const salvar = () => {
    if (
        !nome ||
        !telefone ||
        !tipo ||
        (tipo === 'peso' && !valorKg) ||
        (tipo === 'peca' && pecasSelecionadas.length === 0)
    ) {
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

          {tipo === 'peso' && (
            <>
                <Text style={styles.label}>Valor por Kg *</Text>
                <TextInput
                style={styles.input}
                placeholder="Ex: 5.00"
                placeholderTextColor="#777"
                value={valorKg}
                onChangeText={setValorKg}
                keyboardType="numeric"
                />
            </>
            )}
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

      {/* Seleção de peças */}
      {tipo === 'peca' && (
        <>
          <Text style={styles.label}>Selecione as peças *</Text>

          {pecas.map((item) => {
            const selecionado = pecasSelecionadas.some(
              p => p.id === item.id
            );

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  selecionado && styles.cardSelected,
                ]}
                onPress={() => togglePeca(item)}
              >
                <Text style={styles.text}>
                  {item.nome} - R$ {item.preco}
                </Text>

                {selecionado && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </>
      )}

      <Text style={styles.label}>Período de Cobrança *</Text>

<View style={styles.row}>
  <TouchableOpacity
    style={[styles.radio, periodo === 'diario' && styles.radioActive]}
    onPress={() => setPeriodo('diario')}
  >
    <Text style={styles.radioText}>Diário</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.radio, periodo === 'quinzenal' && styles.radioActive]}
    onPress={() => setPeriodo('quinzenal')}
  >
    <Text style={styles.radioText}>Quinzenal</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.radio, periodo === 'mensal' && styles.radioActive]}
    onPress={() => setPeriodo('mensal')}
  >
    <Text style={styles.radioText}>Mensal</Text>
  </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/cadastro-periodo')}>
    <Text style={styles.radioText}>+ Novo</Text>
  </TouchableOpacity>
</View>

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

  // NOVOS ESTILOS
  card: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  text: {
    color: '#fff',
  },
  check: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
});