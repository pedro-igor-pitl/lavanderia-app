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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import api from '../app/services/api';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

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
    

    const getBase64Logo = async () => {

        const asset = Asset.fromModule(
            require('../assets/images/logoEmpresa/lux_lav_lavanderia_logo.jpeg')
        );

        await asset.downloadAsync();

        const uri = asset.localUri || asset.uri;

        if (!uri) {
            throw new Error('Não foi possível carregar a logo');
        }

        const response = await fetch(uri);

        const blob = await response.blob();

        return await new Promise<string>((resolve, reject) => {

            const reader = new FileReader();

            reader.onloadend = () => {
                resolve(reader.result as string);
            };

            reader.onerror = reject;

            reader.readAsDataURL(blob);

        });
    };

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

    const temPeso = rollsPeso.length > 0;
    const temPeca = rollsPeca.length > 0;

    const gerarPDF = async () => {
        try {

            const asset = Asset.fromModule(
                require('../assets/images/logoEmpresa/lux_lav_lavanderia_logo.jpeg')
            );

            await asset.downloadAsync();

            const logoUri = asset.localUri || asset.uri;

            const logoBase64 = await getBase64Logo();

            const logoSrc = logoBase64;

            const html = `
            <html>

            <head>
                <style>

                    body {
                        font-family: Arial;
                        padding: 20px;
                        color: #000;
                    }

                    .header {
                        width: 100%;
                        margin-bottom: 5px;
                        text-align: center;
                    }

                    .logo {
                        width: 180px;
                        height: 60px;
                        object-fit: contain;
                        display: block;
                        margin: 0 auto;
                    }

                    .cliente {
                        text-align: center;
                        margin-bottom: 15px;
                    }

                    .cliente h1 {
                        margin: 0;
                        font-size: 24px;
                    }

                    .cliente p {
                        margin-top: 10px;
                        font-size: 16px;
                    }

                    h2 {
                        margin-top: 25px;
                        margin-bottom: 10px;
                        font-size: 18px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                        margin-bottom: 20px;
                    }

                    th {
                        background: #EAEAEA;
                    }

                    th, td {
                        border: 1px solid #000;
                        padding: 5px;
                        font-size: 10px;
                        text-align: center;
                        word-break: break-word;
                    }

                    .totalRow {
                        background: #EAEAEA;
                        font-weight: bold;
                    }

                    .footer {
                        margin-top: 30px;
                    }

                    .footerBox {
                        border: 2px solid #000;
                        border-radius: 10px;
                        padding: 12px;
                        margin-bottom: 10px;
                    }

                    .footerTitle {
                        font-size: 12px;
                    }

                    .footerValue {
                        margin-top: 6px;
                        font-size: 16px;
                        font-weight: bold;
                    }

                </style>
            </head>

            <body>
                <div class="header">

                    <img
                        class="logo"
                        src="${logoSrc}"
                    />

                </div>

                <div class="cliente">

                    <h1>${dados[0]?.clienteNome}</h1>

                    <p>
                        ${inicio} - ${fim}
                    </p>

                </div>

                ${temPeso ? `
                    <h2>Rolls por Peso</h2>

                    <table>

                        <tr>
                            <th>Roll</th>
                            <th>Data</th>
                            <th>Peso</th>
                            <th>Valor KG</th>
                            <th>Total</th>
                        </tr>

                        ${rollsPeso.map(item => `
                            <tr>

                                <td>${item.codigoManual}</td>

                                <td>
                                    ${formatarDataBarra(item.dataColeta)}
                                </td>

                                <td>${item.peso} KG</td>

                                <td>
                                    R$ ${item.precoUnitario}
                                </td>

                                <td>
                                    R$ ${(
                                        Number(item.peso || 0) *
                                        Number(item.precoUnitario || 0)
                                    ).toFixed(2)}
                                </td>

                            </tr>
                        `).join('')}

                        <tr class="totalRow">

                            <td>Total por Peso</td>

                            <td></td>

                            <td>
                                ${totalKg.toFixed(2)} KG
                            </td>

                            <td></td>

                            <td>
                                R$ ${totalReaisPeso.toFixed(2)}
                            </td>

                        </tr>

                    </table>
                ` : ''}

                ${temPeca ? `
                    <h2>Rolls por Peça</h2>

                    <table>

                        <tr>
                            <th>Roll</th>
                            <th>Data</th>
                            <th>Peça</th>
                            <th>Qtd</th>
                            <th>Valor</th>
                            <th>Total</th>
                        </tr>

                        ${rollsPeca.map(item => `
                            <tr>

                                <td>${item.codigoManual}</td>

                                <td>
                                    ${formatarDataBarra(item.dataColeta)}
                                </td>

                                <td>${item.pecaNome}</td>

                                <td>${item.quantidade}</td>

                                <td>
                                    R$ ${item.precoUnitario}
                                </td>

                                <td>
                                    R$ ${(
                                        Number(item.quantidade || 0) *
                                        Number(item.precoUnitario || 0)
                                    ).toFixed(2)}
                                </td>

                            </tr>
                        `).join('')}

                        <tr class="totalRow">

                            <td>Total por Peça</td>

                            <td></td>

                            <td></td>

                            <td>${totalPecas}</td>

                            <td></td>

                            <td>
                                R$ ${totalReaisPeca.toFixed(2)}
                            </td>

                        </tr>

                    </table>
                ` : ''}

                <div class="footer">

                    <div class="footerBox">

                        <div class="footerTitle">
                            Total KG
                        </div>

                        <div class="footerValue">
                            ${totalKg.toFixed(2)} KG
                        </div>

                    </div>

                    <div class="footerBox">

                        <div class="footerTitle">
                            Total Peças
                        </div>

                        <div class="footerValue">
                            ${totalPecas}
                        </div>

                    </div>

                    <div class="footerBox">

                        <div class="footerTitle">
                            Total em Reais
                        </div>

                        <div class="footerValue">
                            R$ ${totalReais.toFixed(2)}
                        </div>

                    </div>

                </div>

            </body>

            </html>
            `;

            if (Platform.OS === 'web') {

                const win = window.open('', '_blank');

            if (win) {

                win.document.write(html);

                win.document.close();

                win.onload = () => {
                    setTimeout(() => {
                        win.print();
                    }, 500);
                };
            }

                return;
            }

            const { uri } = await Print.printToFileAsync({
                html,
            });

            await Sharing.shareAsync(uri);

        } catch (error) {
            console.log('Erro ao gerar PDF:', error);
        }
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
                        <TouchableOpacity
                            style={styles.pdfButton}
                            onPress={gerarPDF}
                        >
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
                    {temPeso && (
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
                    </>
                )}

                {temPeca && (
                    <>
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
                    </>
                )}
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