import { createContext, useContext, useState } from 'react';

type Peca = {
  id: string;
  nome: string;
};

type Periodo = {
  id: string;
  nome: string;
};

type Cliente = {
  id: string;
  nome: string;
  tipo: 'peso' | 'peca';
  valorKg?: string;
  pecas?: any[];
  periodo: string;
};

type AppContextType = {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;

  clientes: Cliente[];
  adicionarCliente: (cliente: Cliente) => void;

  periodos: Periodo[];
  adicionarPeriodo: (periodo: Periodo) => void;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: any) {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [periodos, setPeriodos] = useState<Periodo[]>([
    { id: 'diario', nome: 'Diário' },
    { id: 'quinzenal', nome: 'Quinzenal' },
    { id: 'mensal', nome: 'Mensal' },
  ]);

  const adicionarPeca = (peca: Peca) => {
    setPecas(prev => [...prev, peca]);
  };

  const adicionarCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const adicionarPeriodo = (periodo: Periodo) => {
    setPeriodos(prev => [...prev, periodo]);
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

export function useApp() {
  return useContext(AppContext);
}