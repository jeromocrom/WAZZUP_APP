import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Ctx = {
  isModalOpen: boolean;
  open: () => void;
  close: () => void;
  set: (v: boolean) => void;
  counter: number;
};

const GlobalModalContext = createContext<Ctx>({
  isModalOpen: false,
  open: () => {},
  close: () => {},
  set: () => {},
  counter: 0,
});

export function GlobalModalProvider({ children }: { children: React.ReactNode }){
  const [counter, setCounter] = useState(0);
  const isModalOpen = counter > 0;

  const open = useCallback(() => setCounter(c => c + 1), []);
  const close = useCallback(() => setCounter(c => Math.max(0, c - 1)), []);
  const set = useCallback((v: boolean) => setCounter(v ? 1 : 0), []);

  const value = useMemo(() => ({ isModalOpen, open, close, set, counter }), [isModalOpen, open, close, set, counter]);
  return <GlobalModalContext.Provider value={value}>{children}</GlobalModalContext.Provider>;
}

export function useGlobalModal(){
  return useContext(GlobalModalContext);
}
