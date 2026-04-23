import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import api from '../services/api';
import { View, Text } from 'react-native';

export default function CadastrarColeta() {
  const params = useLocalSearchParams();

  const clienteId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [cliente, setCliente] = useState<any>(null);

  useEffect(() => {
    if (!clienteId) return;

    const carregar = async () => {
      try {
        const { data } = await api.get(`/cliente/${clienteId}`);
        setCliente(data);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    };

    carregar();
  }, [clienteId]);

  return (
    <View>
      <Text>Cadastro de Coleta</Text>

      <Text>Cliente: {cliente?.nome}</Text>
    </View>
  );
}