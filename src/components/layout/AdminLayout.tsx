import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavigation } from '@/components/layout/TopNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
