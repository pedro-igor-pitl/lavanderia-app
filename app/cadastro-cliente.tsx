import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useApp } from '../components/AppContext';
import { useRouter } from 'expo-router';

export default function CadastroCliente() {
  const { pecas = [], periodos = [] } = useApp();

  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'peso' | 'peca' | ''>('');
  const [pecasSelecionadas, setPecasSelecionadas] = useState<any[]>([]);
  const [valorKg, setValorKg] = useState('');
  const [periodo, setPeriodo] = useState('');

  const togglePeca = (item: any) => {
    const existe = pecasSelecionadas.find(p => p.id === item.id);

    if (existe) {
      setPecasSelecionadas(prev =>
        prev.filter(p => p.id !== item.id)
      );
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

  const salvar = () => {
    if (
      !nome ||
      !telefone ||
      !tipo ||
      !periodo ||
      (tipo === 'peso' && !valorKg) ||
      (tipo === 'peca' &&
        (pecasSelecionadas.length === 0 ||
          pecasSelecionadas.some(p => !p.precoCliente)))
    ) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    Alert.alert('Sucesso', 'Cliente cadastrado!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Cliente</Text>

      <Text style={styles.label}>Nome *</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        placeholderTextColor="#777"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
      />

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
          style={[styles.radio, tipo === 'peso' && styles.radioActive]}
          onPress={() => setTipo('peso')}
        >
          <Text style={styles.radioText}>Peso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radio, tipo === 'peca' && styles.radioActive]}
          onPress={() => setTipo('peca')}
        >
          <Text style={styles.radioText}>Peça</Text>
        </TouchableOpacity>
      </View>

      {/* KG */}
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

      {/* Peças */}
      {tipo === 'peca' && (
        <>
          <Text style={styles.label}>Selecione as peças *</Text>

          {pecas.map((item) => {
            const selecionada = pecasSelecionadas.find(p => p.id === item.id);

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  selecionada && styles.cardSelected,
                ]}
              >
                <TouchableOpacity onPress={() => togglePeca(item)}>
                  <Text style={styles.text}>
                    {selecionada ? '☑' : '☐'} {item.nome}
                  </Text>
                </TouchableOpacity>

                {selecionada && (
                  <TextInput
                    style={styles.inputSmall}
                    placeholder="R$"
                    placeholderTextColor="#777"
                    keyboardType="numeric"
                    value={selecionada.precoCliente}
                    onChangeText={(value) =>
                      atualizarPreco(item.id, value)
                    }
                  />
                )}
              </View>
            );
          })}
        </>
      )}

      {/* Período */}
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Período *</Text>

        <TouchableOpacity onPress={() => router.push('/cadastro-periodo')}>
          <Text style={styles.addText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {periodos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.radio,
              periodo === item.id && styles.radioActive,
            ]}
            onPress={() => setPeriodo(item.id)}
          >
            <Text style={styles.radioText}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Cliente</Text>
      </TouchableOpacity>
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
    backgroundColor: '#1C1C1E',
    color: '#fff',
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
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});