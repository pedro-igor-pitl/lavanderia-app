import { createContext, useContext, useState } from 'react';

/* ================== TIPOS ================== */

type Peca = {
  id: string;
  nome: string;
};

type ClientePeca = {
  id: string;
  nome: string;
  precoCliente: string;
};

type Periodo = {
  id: string;
  nome: string;
};

type Cliente = {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  tipo: 'peso' | 'peca';
  valorKg?: string;
  pecas?: ClientePeca[];
  periodo: string; // 🔥 agora dinâmico
};

type AppContextType = {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;

  clientes: Cliente[];
  adicionarCliente: (cliente: Cliente) => void;

  periodos: Periodo[];
  adicionarPeriodo: (periodo: Periodo) => void;
};

/* ================== CONTEXT ================== */

const AppContext = createContext<AppContextType>({
  pecas: [],
  adicionarPeca: () => {},

  clientes: [],
  adicionarCliente: () => {},

  periodos: [],
  adicionarPeriodo: () => {},
});

/* ================== PROVIDER ================== */

export function AppProvider({ children }: any) {
  /* 🔹 PEÇAS */
  const [pecas, setPecas] = useState<Peca[]>([
    { id: '1', nome: 'Camisa' },
    { id: '2', nome: 'Calça' },
    { id: '3', nome: 'Toalha' },
  ]);

  const adicionarPeca = (peca: Peca) => {
    setPecas((prev) => [...prev, peca]);
  };

  /* 🔹 PERÍODOS */
  const [periodos, setPeriodos] = useState<Periodo[]>([
    { id: 'diario', nome: 'Diário' },
    { id: 'quinzenal', nome: 'Quinzenal' },
    { id: 'mensal', nome: 'Mensal' },
  ]);

  const adicionarPeriodo = (periodo: Periodo) => {
    setPeriodos((prev) => [...prev, periodo]);
  };

  /* 🔹 CLIENTES MOCKADOS */
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      nome: 'João Silva',
      telefone: '99999-1111',
      tipo: 'peso',
      valorKg: '6.00',
      periodo: 'mensal',
    },
    {
      id: '2',
      nome: 'Maria Souza',
      telefone: '99999-2222',
      tipo: 'peca',
      periodo: 'quinzenal',
      pecas: [
        { id: '1', nome: 'Camisa', precoCliente: '6' },
        { id: '2', nome: 'Calça', precoCliente: '9' },
      ],
    },
    {
      id: '3',
      nome: 'Hotel Beira Mar',
      telefone: '99999-3333',
      tipo: 'peca',
      periodo: 'diario',
      pecas: [
        { id: '3', nome: 'Toalha', precoCliente: '3' },
      ],
    },
  ]);

  const adicionarCliente = (cliente: Cliente) => {
    setClientes((prev) => [...prev, cliente]);
  };

  return (
    <AppContext.Provider
      value={{
        pecas,
        adicionarPeca,

        clientes,
        adicionarCliente,

        periodos,
        adicionarPeriodo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/* ================== HOOK ================== */

export function useApp() {
  return useContext(AppContext);
}