import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useApp } from '../../components/AppContext';

export default function Coleta() {
  const { clientes = [] } = useApp(); // fallback seguro

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modoManual, setModoManual] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [peso, setPeso] = useState('');
  const [pecas, setPecas] = useState<any[]>([]);

  // 📸 Tirar foto
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🖼️ Galeria
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🚀 Upload
  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Selecione uma imagem primeiro');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: 'foto.jpg',
        type: 'image/jpeg',
      } as any);

      await fetch('http://SEU_IP:3000/upload', {
        method: 'POST',
        body: formData,
      });

      Alert.alert('Sucesso', 'Imagem enviada!');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao enviar imagem');
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Selecionar cliente
  const selecionarCliente = (cliente: any) => {
    setClienteSelecionado(cliente);

    if (cliente.tipo === 'peca') {
      setPecas(
        cliente.pecas?.map((p: any) => ({
          ...p,
          quantidade: '',
        })) || []
      );
    } else {
      setPecas([]);
    }
  };

  // 💾 Salvar manual
  const salvarManual = () => {
    if (!clienteSelecionado) {
      Alert.alert('Erro', 'Selecione um cliente');
      return;
    }

    if (clienteSelecionado.tipo === 'peso' && !peso) {
      Alert.alert('Erro', 'Informe o peso');
      return;
    }

    if (
      clienteSelecionado.tipo === 'peca' &&
      pecas.every(p => !p.quantidade)
    ) {
      Alert.alert('Erro', 'Informe ao menos uma peça');
      return;
    }

    Alert.alert('Sucesso', 'Coleta registrada!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nova Coleta</Text>

      {/* ESCOLHA */}
      {!modoManual && !image && (
        <>
          <TouchableOpacity style={styles.card} onPress={takePhoto}>
            <Text style={styles.text}>📸 Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={pickImage}>
            <Text style={styles.text}>🖼️ Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => setModoManual(true)}
          >
            <Text style={styles.text}>✍️ Cadastro Manual</Text>
          </TouchableOpacity>
        </>
      )}

      {/* FOTO */}
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.preview} />

          <TouchableOpacity style={styles.button} onPress={uploadImage}>
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar'}
            </Text>
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
                clienteSelecionado?.id === c.id && styles.cardSelected,
              ]}
              onPress={() => selecionarCliente(c)}
            >
              <Text style={styles.text}>{c.nome}</Text>
            </TouchableOpacity>
          ))}

          {/* PESO */}
          {clienteSelecionado?.tipo === 'peso' && (
            <>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
              />
            </>
          )}

          {/* PEÇAS */}
          {clienteSelecionado?.tipo === 'peca' && (
            <>
              <Text style={styles.label}>Peças</Text>

              {pecas.map((item, index) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.text}>{item.nome}</Text>

                  <TextInput
                    style={styles.inputSmall}
                    placeholder="Qtd"
                    placeholderTextColor="#777"
                    keyboardType="numeric"
                    value={item.quantidade}
                    onChangeText={(value) => {
                      const novaLista = [...pecas];
                      novaLista[index].quantidade = value;
                      setPecas(novaLista);
                    }}
                  />
                </View>
              ))}
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={salvarManual}>
            <Text style={styles.buttonText}>Salvar Coleta</Text>
          </TouchableOpacity>
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