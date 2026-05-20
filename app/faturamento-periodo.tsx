import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function FaturamentoPeriodo() {
  const { clienteId, inicio, fim } = useLocalSearchParams();

  const dados = [
    {
      roll: 'ROLL-001',
      data: '20/05/2026',
      valorKg: 'R$ 12,00',
      total: 'R$ 240,00',
    },
    {
      roll: 'ROLL-002',
      data: '21/05/2026',
      valorKg: 'R$ 10,00',
      total: 'R$ 180,00',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text>Logo da empresa</Text>
          </View>

          <View style={styles.clienteInfo}>
            <Text style={styles.nomeCliente}>Nome Cliente</Text>

            <Text style={styles.periodo}>
              {inicio} - {fim}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.pdfButton}>
              <Text style={styles.pdfText}>Gerar PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whatsappButton}>
              <Text style={styles.whatsappText}>Enviar para WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TABELA */}
        <View style={styles.tableContainer}>
          {/* Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>Roll</Text>
            <Text style={[styles.cell, styles.headerCell]}>Data</Text>
            <Text style={[styles.cell, styles.headerCell]}>Valor KG</Text>
            <Text style={[styles.cell, styles.headerCell]}>
              Total Referente
            </Text>
          </View>

          {/* Dados */}
          {dados.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.roll}</Text>
              <Text style={styles.cell}>{item.data}</Text>
              <Text style={styles.cell}>{item.valorKg}</Text>
              <Text style={styles.cell}>{item.total}</Text>
            </View>
          ))}
        </View>

        {/* TOTAIS */}
        <View style={styles.footer}>
          <View style={styles.totalBox}>
            <Text>Total KG</Text>
            <Text>120 KG</Text>
          </View>

          <View style={styles.totalBox}>
            <Text>Total em Reais</Text>
            <Text>R$ 420,00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  content: {
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  logoBox: {
    width: 140,
    height: 80,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  clienteInfo: {
    alignItems: 'center',
  },

  nomeCliente: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  periodo: {
    fontSize: 16,
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  pdfButton: {
    borderWidth: 2,
    borderColor: '#8B0000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },

  pdfText: {
    color: '#8B0000',
    fontWeight: 'bold',
  },

  whatsappButton: {
    borderWidth: 2,
    borderColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },

  whatsappText: {
    color: 'green',
    fontWeight: 'bold',
  },

  tableContainer: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },

  headerRow: {
    backgroundColor: '#EAEAEA',
  },

  row: {
    flexDirection: 'row',
  },

  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
  },

  headerCell: {
    fontWeight: 'bold',
  },

  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  totalBox: {
    width: 180,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFF',
  },
});