import { ReactNode } from 'react';
import { Header } from '../organisms/header';
import { Sidebar } from '../organisms/sidebar';


interface DashboardTemplateProps {
  children: ReactNode;
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

