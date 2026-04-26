// import { useEffect, useState } from 'react';
// import { useLocalSearchParams } from 'expo-router';
// import api from '../services/api';
// import {
//   View,
//   Text,
//   Alert,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useRouter } from 'expo-router';

// export default function VizualizarColeta() {
//   const params = useLocalSearchParams();

//   const clienteId = Array.isArray(params.id)
//     ? params.id[0]
//     : params.id;

//   const [cliente, setCliente] = useState<any>(null);
//   const [tipo, setTipo] = useState<'PESO' | 'PECA' | null>(null);

//   const [numeroRoll, setNumeroRoll] = useState('');
//   const [dataRoll, setDataRoll] = useState('');

//   const [peso, setPeso] = useState('');
//   const [quantidades, setQuantidades] = useState<{ [key: string]: string }>({});

//   const router = useRouter();

//   useEffect(() => {
//     if (!clienteId) return;

//     const carregar = async () => {
//       try {
//         const { data } = await api.get(
//           `/coleta/vizualizarColeta?${clienteId}&${}`
//         );

//         setCliente(data);
//         setTipo(data.tipoCliente);

//         console.log('Dados de CLiente completo:', data);

//       } catch (error) {
//         console.error('Erro:', error);
//       }
//     };

//     carregar();
//   }, [clienteId]);

//   const handleQuantidadeChange = (pecaId: string, valor: string) => {
//     setQuantidades((prev) => ({
//       ...prev,
//       [pecaId]: valor,
//     }));
//   };

//   const calcularTotal = (peca: any) => {
//     const quantidade = Number(quantidades[peca.pecaId] || 0);
//     const preco = Number(peca.precoCliente || 0);

//     const total = quantidade * preco;

//     return total.toFixed(2);
//   };

//   const formatarData = (valor: string) => {
//     let v = valor.replace(/\D/g, '');

//     // aplica máscara
//     if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
//     if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);

//     return v;
//   };

//   const calcularQuantidadeTotal = () => {
//     return Object.values(quantidades).reduce((total, qtd) => {
//       return total + Number(qtd || 0);
//     }, 0);
//   };

//   const calcularValorTotal = () => {
//     if (!cliente?.pecas) return 0;

//     return cliente.pecas.reduce((total: number, peca: any) => {
//       const quantidade = Number(quantidades[peca.pecaId] || 0);
//       const preco = Number(peca.precoCliente || 0);

//       return total + quantidade * preco;
//     }, 0);
//   };

//   const calcularTotalPeso = () => {
//     const pesoNum = Number(peso || 0);
//     const valorKg = Number(cliente?.valorKg || 0);

//     return (pesoNum * valorKg).toFixed(2);
//   };

//   const apenasNumerosDecimal = (valor: string) => {
//     return valor
//       .replace(/[^0-9.,]/g, '')   // remove letras
//       .replace(',', '.');         // troca vírgula por ponto
//   };


//   const SalvarNovaColeta = async () => {
//     const dataValida = /^\d{2}\/\d{2}\/\d{4}$/.test(dataRoll);

//     if (
//       !numeroRoll ||
//       !clienteId ||
//       !dataValida ||
//       (tipo === 'PESO' && (!peso || Number(peso) <= 0)) ||
//       (tipo === 'PECA' &&
//         (!cliente?.pecas ||
//           Object.values(quantidades).every(q => Number(q) <= 0)))
//     ) {
//       Alert.alert('Erro', 'Preencha todos os campos corretamente');
//       return;
//     }

//     try {
//       let payload: any = {
//         codigo_manual: numeroRoll,
//         cliente_id: clienteId,
//         data_coleta: formatarDataParaBackend(dataRoll),
//       };

//       if (tipo == 'PECA') {
//         payload.itens = cliente.pecas.map((peca: any) => ({
//           peca_id: peca.pecaId,
//           quantidade: Number(quantidades[peca.pecaId] || 0),
//           preco_unitario: Number(peca.precoCliente || 0),
//         }));
//       }

//       if (tipo == 'PESO') {
//         payload.peso = Number(cliente?.valorKg || 0);
//       }

//        console.log(JSON.stringify(payload, null, 2));

//        await api.post('/coleta/cadastrarRoll', payload);

//        alert('Coleta salva com sucesso!');
//     } catch (error) {
//       console.error('Erro ao salvar coleta');
//     }
//   };

//   const formatarDataParaBackend = (data: string) => {
//     const [dia, mes, ano] = data.split('/');
//     return `${ano}-${mes}-${dia}`;
//   };

//   const apenasInteiros = (valor: string) => {
//     return valor.replace(/\D/g, '');
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.titulo}>Vizualizar Coleta</Text>

//       {/* Dados do Roll */}
//       <View style={styles.card}>
//         <View style={styles.rowBetween}>

//           {/* Cliente */}
//           <View style={{ flex: 1, marginRight: 8 }}>
//             <Text style={styles.label}>Cliente</Text>
//             <TextInput
//               style={[styles.input, styles.inputDisabled]}
//               value={cliente?.nome || ''}
//               editable={false}
//             />
//           </View>

//           {/* Número do Roll */}
//           <View style={{ flex: 1, marginRight: 8 }}>
//             <Text style={styles.label}>Nº Roll</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="12345"
//               placeholderTextColor="#777"
//               value={numeroRoll}
//               onChangeText={setNumeroRoll}
//             />
//           </View>

//           {/* Data */}
//           <View style={{ flex: 1, marginRight: 8 }}>
//             <Text style={styles.label}>Data</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="01/01/0001"
//               placeholderTextColor="#777"
//               value={dataRoll}
//               onChangeText={(text) => setDataRoll(formatarData(text))}
//               maxLength={10}
//             />
//           </View>

//         </View>
//       </View>

//       {/* Peso */}
//       {tipo === 'PESO' && (
//         <View style={styles.card}>
//           <View style={styles.rowBetween}>

//             {/* Peso */}
//             <View style={{ flex: 1, marginRight: 8 }}>
//               <Text style={styles.label}>Peso (kg)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={peso}
//                 onChangeText={(text) => setPeso(apenasNumerosDecimal(text))}
//                 keyboardType="numeric"
//               />
//             </View>

//             {/* Total */}
//             <View style={{ flex: 1, marginLeft: 8 }}>
//               <Text style={styles.label}>Total</Text>
//               <View style={[styles.input, styles.inputDisabledDark]}>
//                 <Text style={{ color: '#009b1a' }}>
//                   R$ {calcularTotalPeso()}
//                 </Text>
//               </View>
//             </View>

//           </View>

//           <TouchableOpacity 
//             style={styles.button}
//             onPress={() => {
//               SalvarNovaColeta();
//               router.push('/coleta');
//             }}
//           >   
//             <Text style={styles.buttonText}>Salvar</Text>
//           </TouchableOpacity>

//         </View>
//       )}

//       {/* Peças */}
//       {tipo === 'PECA' && (
//         <View style={styles.card}>
//           {cliente?.pecas?.map((peca: any) => (
//             <View key={peca.pecaId} style={styles.pecaItem}>
//               <Text style={styles.pecaNome}>{peca.nome}</Text>

//               <View style={styles.rowBetween}>
//                 <View style={{ flex: 1, marginRight: 8 }}>
//                   <Text style={styles.pecaNome}>Quantidade</Text>
//                   <TextInput
//                     style={styles.input}
//                     keyboardType="number-pad"
//                     value={quantidades[peca.pecaId] || ''}
//                     onChangeText={(valor) =>
//                       handleQuantidadeChange(peca.pecaId, apenasInteiros(valor))
//                     }
//                   />
//                 </View>

//                 <View style={{ flex: 1, marginLeft: 8 }}>
//                   <Text style={styles.pecaNome}>Total</Text>
//                     <View style={[styles.input, styles.inputDisabledDark]}>
//                       <Text style={{ color: '#009b1a' }}>
//                         R$ {calcularTotal(peca)}
//                       </Text>
//                     </View>
//                 </View>
//               </View>

//             </View>
//           ))}

//       <View style={styles.card}>
//         <View style={styles.rowBetween}>

//           <View style={{ flex: 1, marginRight: 8 }}>
//             <Text style={styles.pecaNome}>Quantidade Total de Peças</Text>
//             <View style={[styles.input, styles.inputDisabledDark]}>
//               <Text style={{ color: '#d6d6d6' }}>
//                 {calcularQuantidadeTotal()}
//               </Text>
//             </View>
//           </View>

//           {/* Data */}
//           <View style={{ flex: 1, marginRight: 8 }}>
//             <Text style={styles.pecaNome}>Valor Total</Text>
//             <View style={[styles.input, styles.inputDisabledDark]}>
//               <Text style={{ color: '#009b1a' }}>
//                 R$ {calcularValorTotal().toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//         <TouchableOpacity 
//             style={styles.button}             
//             onPress={() => {
//               SalvarNovaColeta();
//               router.push('/coleta');
//             }}>
//           <Text style={styles.buttonText}>Salvar</Text>
//         </TouchableOpacity>

//       </View>

        
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#2563EB',
//     padding: 16,
//     borderRadius: 10,
//     marginTop: 30,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   inputDisabledDark: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#2a2a2a',
//     color: '#888',
//     opacity: 0.7,
//   },
//   numeroDataRollEntre: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   rowBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   labelClienteInformativo: {
//     fontSize: 15,
//     color: '#bbbbbb',
//     marginBottom: 20,
//     fontWeight: '500',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#0F0F0F',
//     padding: 16,
//   },

//   titulo: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#2f3640',
//   },

//   label: {
//     fontSize: 14,
//     color: '#aaa',
//     marginBottom: 4,
//   },

//   input: {
//     backgroundColor: '#1C1C1E',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333333',
//     color: 'white',
//   },

//   inputDisabled: {
//     backgroundColor: '#2a2a2a',
//     borderColor: '#2a2a2a',
//     color: '#888',
//     opacity: 0.7,
//     textAlign: 'center',
//   },

//   card: {
//     backgroundColor: 'rgba(28,28,30,1.00)',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#333333',
//   },

//   pecaItem: {
//     marginBottom: 12,
//   },

//   pecaNome: {
//     fontSize: 15,
//     color: '#7f8c8d',
//     marginBottom: 10,
//     fontWeight: '500',
//   },
// });