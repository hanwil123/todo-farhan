"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  status? : string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: ReactNode;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
    const newToast = { ...toast, id };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically remove the toast after the specified duration
    setTimeout(() => removeToast(id), toast.duration || 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-md ${
              toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-gray-800 text-white"
            }`}
          >
            {toast.title && <strong>{toast.title}</strong>}
            {toast.description && <p>{toast.description}</p>}
            {toast.action && <div className="mt-2">{toast.action}</div>}
            {toast.status && <p>{toast.status}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
