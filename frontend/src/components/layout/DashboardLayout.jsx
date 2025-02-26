import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children, sidebar: Sidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen",
          "w-[220px] sm:w-[240px] lg:w-[250px]", // Reduced widths
          "transition-all duration-300 ease-in-out",
          "z-40 bg-background shadow-lg", // Added shadow for better visibility
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        "w-full lg:ml-[250px]",
        "relative"
      )}>
        {/* Toggle Button Container - Solid background */}
        <div className="sticky top-0 z-50 p-4 lg:hidden bg-background border-b">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Page Content */}
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
