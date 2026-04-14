import { createContext, useContext, useState } from 'react';

type Peca = {
  id: string;
  nome: string;
  preco: string;
};

type AppContextType = {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;
};

const AppContext = createContext({
  pecas: [],
  adicionarPeca: (peca: any) => {},
});

export function AppProvider({ children }: any) {
  const [pecas, setPecas] = useState<Peca[]>([]);

  const adicionarPeca = (peca: Peca) => {
    setPecas((prev) => [...prev, peca]);
  };

  return (
    <AppContext.Provider value={{ pecas, adicionarPeca }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}