import { createContext, useContext, useState } from 'react';

type Peca = {
  id: string;
  nome: string;
  preco: string;
};

type Periodo = {
  id: string;
  nome: string;
};

type AppContextType = {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;
  periodos: Periodo[];
  adicionarPeriodo: (periodo: Periodo) => void;
};

const AppContext = createContext<AppContextType>({
  pecas: [],
  adicionarPeca: () => {},
  periodos: [],
  adicionarPeriodo: () => {},
});

export function AppProvider({ children }: any) {
  const [pecas, setPecas] = useState<Peca[]>([]);

  const adicionarPeca = (peca: Peca) => {
    setPecas((prev) => [...prev, peca]);
  };

  const [periodos, setPeriodos] = useState<Periodo[]>([
    { id: 'diario', nome: 'Diário' },
    { id: 'quinzenal', nome: 'Quinzenal' },
    { id: 'mensal', nome: 'Mensal' },
  ]);

  const adicionarPeriodo = (periodo: Periodo) => {
    const existe = periodos.find(p => p.id === periodo.id);

    if (existe) return;

    setPeriodos(prev => [...prev, periodo]);
  };

  return (
    <AppContext.Provider
      value={{ pecas, adicionarPeca, periodos, adicionarPeriodo }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}