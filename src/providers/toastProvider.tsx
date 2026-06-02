"use client";

import { createContext, useContext, useState } from "react";

interface toastContextType {
  open: boolean
  message: string;
  setMessage: (message: string) => void;
  setOpen: (value: boolean) => void;
}

// 1. Create the context
const ToastContext = createContext<toastContextType | undefined>(undefined);

// 2. Create the provider component
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <ToastContext.Provider value={{ message, setMessage, open, setOpen }}>
      {open ? (
        <div className="p-4">
          <div className="flex items-center w-full p-4 text-neutral-950 bg-neutral-300 rounded-lg shadow dark:bg-gray-800 dark:text-gray-400" role="alert">
            <div className="inline-flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              ICON
            </div>
            <div className="ms-3 text-sm font-normal">
             Hola, Usuario: ya esta disponible la votacion para los proximos pack ingresa aquí <a> Participa</a> y dejanos tu voto.
            </div>
            <button
              onClick={() => { setOpen(false) }}
              className="btn-primary-icon rounded-lg shadow-lg top-4 right-4 px-1"
            >
             ICON X
            </button>
          </div>
        </div>
      ) : (<></>)}

      {children}
    </ToastContext.Provider>
  );
}

// 3. Create a custom hook for easy consumption

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
