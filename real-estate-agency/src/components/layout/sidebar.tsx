"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Home, Settings, ClipboardList, PlusCircle, ShieldAlert, UserPlus, FileText, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/use-user";

export function Sidebar() {
    const pathname = usePathname();
    const { data: profile } = useProfile();

    const sidebarNavItems = [
        { title: "Профиль", href: "/dashboard/profile", icon: User },
        { title: "Мои объекты", href: "/dashboard/objects", icon: Home },
        { title: "Добавить объект", href: "/dashboard/objects/add", icon: PlusCircle },
        {
            // Динамическое название в зависимости от роли
            title: profile?.role === "Client" ? "Мои сделки" : "Реестр сделок",
            href: "/dashboard/contracts",
            icon: profile?.role === "Client" ? FileText : ClipboardList
        },
        { title: "Настройки", href: "/dashboard/settings", icon: Settings },
        {
            title: "Модерация",
            href: "/dashboard/admin",
            icon: ShieldAlert,
            roles: ["Admin", "Employee"]
        },
        {
            title: "Сотрудники",
            href: "/dashboard/admin/employees/add",
            icon: UserPlus,
            roles: ["Admin"]
        },
        {
            title: "Аналитика",
            href: "/dashboard/admin/reports",
            icon: TrendingUp, 
            roles: ["Admin", "Employee"]
        },
    ];

    const filteredItems = sidebarNavItems.filter(item => {
        if (!item.roles) return true;
        if (!profile?.role) return false;
        return item.roles.includes(profile.role);
    });

    return (
        <nav className="flex flex-col space-y-1">
            {filteredItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}