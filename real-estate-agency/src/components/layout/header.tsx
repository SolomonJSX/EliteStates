"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, LayoutDashboard } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfile } from "@/hooks/use-user";
import {getImageUrl} from "@/lib/config";

const navItems = [
    { name: "Главная", href: "/" },
    { name: "Купить", href: "/buy" },
    { name: "Продать", href: "/sell" },
    { name: "Список", href: "/listing" },
    { name: "Контакты", href: "/contacts" },
];

export default function Header() {
    const { data: profile } = useProfile();
    const { email, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Пока компонент не примонтирован, не показываем блок авторизации вообще,
    // чтобы избежать ошибок гидратации
    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Building2 className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight uppercase">EliteStates</span>
                    </div>
                    <div className="w-20" /> {/* Пустое место вместо кнопок */}
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight uppercase">EliteStates</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="transition-colors hover:text-primary text-muted-foreground"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Auth Block */}
                <div className="flex items-center space-x-4">
                    {email ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={getImageUrl(profile?.avatarUrl)}
                                    alt={email}
                                    className="object-cover"
                                />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {/* Безопасное получение первой буквы */}
                                            {email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Личный кабинет</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Панель управления
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Выйти
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                                Sign In
                            </Link>
                            <Button asChild>
                                <Link href="/register">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}