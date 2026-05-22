import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    useWindowDimensions,
    Image,
} from 'react-native';

import api from '../app/services/api';

interface RelatorioItem {
    clienteNome: string;
    codigoManual: string;
    dataColeta: string;
    tipoClienteHistorico: string;
    peso?: number;
    quantidade?: number;
    precoUnitario?: number;
    pecaNome?: string;
}

export default function FaturamentoPeriodo() {
    const { clienteId, inicio, fim } = useLocalSearchParams();

    const [dados, setDados] = useState<RelatorioItem[]>([]);
    const [loading, setLoading] = useState(false);

    const { width } = useWindowDimensions();

    const isMobile = width < 768;

    useEffect(() => {
        buscarRelatorio();
    }, []);

    const formatarData = (data: string) => {
        const [dia, mes, ano] = data.split('/');

        return `${ano}-${mes}-${dia}`;
    };

    const inicioFormatado = formatarData(inicio as string);
    const fimFormatado = formatarData(fim as string);

    const buscarRelatorio = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/financeiro/relatorioRollsPorPeriodo?clienteId=${clienteId}&inicio=${inicioFormatado}&fim=${fimFormatado}`
            );

            setDados(response.data);

        } catch (error) {
            console.log('Erro ao buscar relatório:', error);
        } finally {
            setLoading(false);
        }
    };

    const rollsPeso = dados.filter(
        (item) => item.tipoClienteHistorico === 'PESO'
    );

    const rollsPeca = dados.filter(
        (item) => item.tipoClienteHistorico === 'PECA'
    );

    const totalKg = rollsPeso.reduce(
        (acc, item) => acc + Number(item.peso || 0),
        0
    );

    const totalPecas = rollsPeca.reduce(
        (acc, item) => acc + Number(item.quantidade || 0),
        0
    );

    const totalReaisPeso = rollsPeso.reduce(
        (acc, item) =>
            acc + (
                Number(item.peso || 0) *
                Number(item.precoUnitario || 0)
            ),
        0
    );

    const totalReaisPeca = rollsPeca.reduce(
        (acc, item) =>
            acc + (
                Number(item.quantidade || 0) *
                Number(item.precoUnitario || 0)
            ),
        0
    );

    const totalReais = totalReaisPeso + totalReaisPeca;

    const formatarDataBarra = (data: string) => {
        if (!data) return '';

        const [ano, mes, dia] = data.split('-');

        return `${dia}/${mes}/${ano}`;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>

                {/* HEADER */}
                <View
                    style={[
                        styles.header,
                        isMobile && styles.headerMobile,
                    ]}
                >
                    <View style={styles.logoBox}>
                        <Image
                            source={require('../assets/images/logoEmpresa/lux_lav_lavanderia_logo.jpeg')}
                            style={[
                                styles.logo,
                                isMobile && styles.logoMobile,
                            ]}
                        />
                    </View>

                    <View style={styles.clienteInfo}>
                        <Text style={styles.nomeCliente}>
                            {dados[0]?.clienteNome}
                        </Text>

                        <Text style={styles.periodo}>
                            {inicio} - {fim}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.buttonsContainer,
                            isMobile && styles.buttonsContainerMobile,
                        ]}
                    >
                        <TouchableOpacity style={styles.pdfButton}>
                            <Text style={styles.pdfText}>
                                Gerar PDF
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.whatsappButton}>
                            <Text style={styles.whatsappText}>
                                Enviar para WhatsApp
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LOADING */}
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <>
                        {/* TABELA PESO */}
                        <Text style={styles.sectionTitle}>
                            Rolls por Peso
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator
                        >
                            <View style={styles.tableContainer}>

                                <View style={[styles.row, styles.headerRow]}>
                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Roll
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Data
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Peso KG
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Valor KG
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Total
                                    </Text>
                                </View>

                                {rollsPeso.map((item, index) => (
                                    <View style={styles.row} key={index}>

                                        <Text style={styles.cell}>
                                            {item.codigoManual}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {formatarDataBarra(item.dataColeta)}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {item.peso} KG
                                        </Text>

                                        <Text style={styles.cell}>
                                            R$ {item.precoUnitario}
                                        </Text>

                                        <Text style={styles.cell}>
                                            R$ {
                                                (
                                                    Number(item.peso || 0) *
                                                    Number(item.precoUnitario || 0)
                                                ).toFixed(2)
                                            }
                                        </Text>

                                    </View>
                                ))}

                                <View style={[styles.row, styles.totalRow]}>
                                    <Text style={styles.cell}>
                                        Total por Peso
                                    </Text>

                                    <Text style={styles.cell}></Text>

                                    <Text
                                        style={[
                                            styles.cell,
                                            styles.boldText,
                                        ]}
                                    >
                                        {totalKg.toFixed(2)} KG
                                    </Text>

                                    <Text style={styles.cell}></Text>

                                    <Text
                                        style={[
                                            styles.cell,
                                            styles.boldText,
                                        ]}
                                    >
                                        R$ {totalReaisPeso.toFixed(2)}
                                    </Text>
                                </View>

                            </View>
                        </ScrollView>

                        {/* TABELA PEÇA */}
                        <Text style={styles.sectionTitle}>
                            Rolls por Peça
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator
                        >
                            <View style={styles.tableContainer}>

                                <View style={[styles.row, styles.headerRow]}>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Roll
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Data
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Peça
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Quantidade
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Valor Unitário
                                    </Text>

                                    <Text style={[styles.cell, styles.headerCell]}>
                                        Total
                                    </Text>

                                </View>

                                {rollsPeca.map((item, index) => (
                                    <View style={styles.row} key={index}>

                                        <Text style={styles.cell}>
                                            {item.codigoManual}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {formatarDataBarra(item.dataColeta)}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {item.pecaNome}
                                        </Text>

                                        <Text style={styles.cell}>
                                            {item.quantidade}
                                        </Text>

                                        <Text style={styles.cell}>
                                            R$ {item.precoUnitario}
                                        </Text>

                                        <Text style={styles.cell}>
                                            R$ {
                                                (
                                                    Number(item.quantidade || 0) *
                                                    Number(item.precoUnitario || 0)
                                                ).toFixed(2)
                                            }
                                        </Text>

                                    </View>
                                ))}

                                <View style={[styles.row, styles.totalRow]}>

                                    <Text style={styles.cell}>
                                        Total por Peça
                                    </Text>

                                    <Text style={styles.cell}></Text>

                                    <Text style={styles.cell}></Text>

                                    <Text
                                        style={[
                                            styles.cell,
                                            styles.boldText,
                                        ]}
                                    >
                                        {totalPecas}
                                    </Text>

                                    <Text style={styles.cell}></Text>

                                    <Text
                                        style={[
                                            styles.cell,
                                            styles.boldText,
                                        ]}
                                    >
                                        R$ {totalReaisPeca.toFixed(2)}
                                    </Text>

                                </View>

                            </View>
                        </ScrollView>

                        {/* FOOTER */}
                        <View
                            style={[
                                styles.footer,
                                isMobile && styles.footerMobile,
                            ]}
                        >

                            <View style={styles.totalBox}>
                                <Text>Total KG</Text>

                                <Text style={styles.boldText}>
                                    {totalKg.toFixed(2)} KG
                                </Text>
                            </View>

                            <View style={styles.totalBox}>
                                <Text>Total Peças</Text>

                                <Text style={styles.boldText}>
                                    {totalPecas}
                                </Text>
                            </View>

                            <View style={styles.totalBox}>
                                <Text>Total em Reais</Text>

                                <Text style={styles.boldText}>
                                    R$ {totalReais.toFixed(2)}
                                </Text>
                            </View>

                        </View>
                    </>
                )}
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
        gap: 20,
    },

    headerMobile: {
        flexDirection: 'column',
    },

    logoBox: {
        width: 300,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: 270,
        height: 60,
        resizeMode: 'contain',
    },

    logoMobile: {
        width: 220,
        height: 50,
    },

    clienteInfo: {
        alignItems: 'center',
    },

    nomeCliente: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },

    periodo: {
        fontSize: 16,
        textAlign: 'center',
    },

    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
    },

    buttonsContainerMobile: {
        width: '100%',
        flexDirection: 'column',
    },

    pdfButton: {
        borderWidth: 2,
        borderColor: '#8B0000',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
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
        alignItems: 'center',
    },

    whatsappText: {
        color: 'green',
        fontWeight: 'bold',
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
    },

    tableContainer: {
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#FFF',
        minWidth: 700,
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
        minWidth: 120,
    },

    headerCell: {
        fontWeight: 'bold',
    },

    totalRow: {
        backgroundColor: '#EAEAEA',
    },

    footer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },

    footerMobile: {
        flexDirection: 'column',
        alignItems: 'center',
    },

    totalBox: {
        width: 180,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#FFF',
        gap: 10,
    },

    boldText: {
        fontWeight: 'bold',
    },
});