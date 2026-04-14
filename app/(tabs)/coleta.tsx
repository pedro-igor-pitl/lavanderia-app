import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function Coleta() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 📸 Tirar foto
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
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

  // 🚀 Enviar para backend
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

      const response = await fetch('http://SEU_IP:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      Alert.alert('Sucesso', 'Imagem enviada!');
      console.log(data);

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao enviar imagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Coleta</Text>

      {!image ? (
        <>
          <TouchableOpacity style={styles.card} onPress={takePhoto}>
            <Text style={styles.text}>📸 Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={pickImage}>
            <Text style={styles.text}>🖼️ Galeria</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image source={{ uri: image }} style={styles.preview} />

          <TouchableOpacity style={styles.button} onPress={uploadImage}>
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar para sistema'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setImage(null)}>
            <Text style={styles.reset}>Escolher outra imagem</Text>
          </TouchableOpacity>
        </>
      )}
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
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
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
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  reset: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
});