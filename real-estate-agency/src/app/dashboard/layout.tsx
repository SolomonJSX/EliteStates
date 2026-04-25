import { Sidebar } from "@/components/layout/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto py-6 md:py-10">
            {/* Используем md:flex для разделения на колонки начиная с планшетов */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-12">

                {/* Левая колонка - Sidebar */}
                <aside>
                    <h2 className="text-2xl font-bold tracking-tight mb-8">
                        Панель управления
                    </h2>
                    <Sidebar />
                </aside>

                {/* Правая колонка - Контент */}
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}