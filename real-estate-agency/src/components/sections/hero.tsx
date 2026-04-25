"use client";

import { Search, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Hero() {
    // Данные сотрудников (потом можно тянуть из API)
    const topEmployees = [
        { name: "Алихан", image: "https://i.pravatar.cc/150?u=1", role: "Топ-агент" },
        { name: "Мария", image: "https://i.pravatar.cc/150?u=2", role: "Эксперт по ЖК" },
        { name: "Сергей", image: "https://i.pravatar.cc/150?u=3", role: "Юрист" },
        { name: "Елена", image: "https://i.pravatar.cc/150?u=4", role: "Аренда" },
    ];

    return (
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
            {/* Декоративный фон */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
                    alt="Modern House"
                    className="w-full h-full object-cover object-center"
                />
            </div>

            <div className="container relative z-20">
                <div className="max-w-[750px] space-y-10">
                    {/* Текст */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Лидер рынка Караганды 2026
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            Найдите идеальное место для <span className="text-primary italic">жизни</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] font-medium">
                            Крупнейшая база недвижимости: от уютных квартир на Юго-Востоке до элитных особняков.
                        </p>
                    </div>

                    {/* Панель поиска */}
                    <div className="p-2 bg-background/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl max-w-2xl transition-all hover:border-primary/30">
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                <Input
                                    placeholder="Где хотите жить?"
                                    className="pl-12 h-14 bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-muted-foreground/60"
                                />
                            </div>
                            <Button size="lg" className="h-14 px-10 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <Search className="mr-2 h-5 w-5" />
                                Найти дом
                            </Button>
                        </div>
                    </div>

                    {/* Блок статистики и СОТРУДНИКОВ */}
                    <div className="flex flex-wrap items-center gap-12 pt-6">
                        {/* Статистика */}
                        <div className="flex gap-10">
                            <div className="space-y-1">
                                <p className="text-3xl font-black">1.2k+</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Объектов</p>
                            </div>
                            <div className="space-y-1 border-l pl-10">
                                <p className="text-3xl font-black">500+</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Клиентов</p>
                            </div>
                        </div>

                        {/* СОТРУДНИКИ */}
                        <div className="flex items-center gap-4 bg-background/30 backdrop-blur-md p-2 pr-6 rounded-2xl border border-white/10">
                            <div className="flex -space-x-3">
                                <TooltipProvider>
                                    {topEmployees.map((emp, i) => (
                                        <Tooltip key={i}>
                                            <TooltipTrigger asChild>
                                                <Avatar className="h-12 w-12 border-4 border-background hover:-translate-y-1 transition-transform cursor-pointer">
                                                    <AvatarImage src={emp.image} alt={emp.name} />
                                                    <AvatarFallback>{emp.name[0]}</AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-xl border-none bg-primary text-white font-bold px-4 py-2">
                                                <p>{emp.name} — {emp.role}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </TooltipProvider>
                                <div className="h-12 w-12 rounded-full border-4 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                    +12
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-black uppercase leading-tight">Наши эксперты</p>
                                <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                                    <Users className="h-3 w-3" /> Всегда на связи
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}