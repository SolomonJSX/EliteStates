"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
    PlusCircle, 
    Camera, 
    ShieldCheck, 
    TrendingUp, 
    ArrowRight,
    Building2,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";

export default function SellPage() {
    const { email } = useAuthStore();

    const steps = [
        {
            title: "Создайте объявление",
            description: "Опишите ваш объект, укажите район, площадь и цену. Это займет не более 5 минут.",
            icon: PlusCircle,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Загрузите фото",
            description: "Качественные фотографии увеличивают количество просмотров в 3 раза. Наша система оптимизирует их для сайта.",
            icon: Camera,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            title: "Проверка и публикация",
            description: "Модераторы EliteStates проверят данные, и ваше объявление появится в каталоге Караганды.",
            icon: ShieldCheck,
            color: "text-green-500",
            bg: "bg-green-50"
        }
    ];

    const benefits = [
        "Бесплатное размещение для всех владельцев",
        "Индивидуальное сопровождение риелтором",
        "Юридическая чистота сделок через реестр контрактов",
        "Охват более 10 000 потенциальных покупателей ежемесячно"
    ];

    return (
        <div className="flex flex-col gap-20 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 bg-card overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                            <TrendingUp className="h-4 w-4" /> Ваш успех начинается здесь
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                            Продайте свою <span className="text-primary">недвижимость</span> быстро
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-lg mx-auto lg:mx-0">
                            EliteStates — самая технологичная площадка для продажи жилья в Караганде. Мы превращаем поиск покупателя в простую сделку.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 group">
                                <Link href={email ? "/dashboard/objects/add" : "/login"}>
                                    Начать продажу <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold">
                                Узнать тарифы
                            </Button>
                        </div>
                    </div>
                    
                    {/* Визуальный элемент: имитация карточки объекта */}
                    <div className="hidden lg:block relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-30" />
                        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700">
                            <div className="aspect-video relative overflow-hidden bg-muted">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                    <Building2 className="h-32 w-32" />
                                </div>
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-primary shadow-xl">
                                    32 500 000 ₸
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-4">
                                <h3 className="text-2xl font-bold uppercase">ЖК "Комфортный дом"</h3>
                                <div className="flex gap-4 text-muted-foreground font-bold text-sm uppercase tracking-widest">
                                    <span>64.5 м²</span>
                                    <span>Юго-Восток</span>
                                </div>
                                <div className="pt-4 border-t flex justify-between items-center">
                                    <span className="text-xs font-bold text-green-600 uppercase">Популярное</span>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted" />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="container">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Как это работает</h2>
                    <p className="text-muted-foreground">Три простых шага до успешной сделки</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group p-8 rounded-[2.5rem] bg-card border hover:border-primary/50 transition-all duration-500">
                            <div className={`h-16 w-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 uppercase">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container">
                <div className="rounded-[3rem] bg-muted/30 border border-muted p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl font-black uppercase tracking-tight">Почему выбирают <br/> <span className="text-primary">EliteStates?</span></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                                    <span className="font-bold text-sm text-foreground/80">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="px-0 font-black uppercase tracking-widest text-primary h-auto group">
                            Посмотреть статистику сервиса <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </div>
                    <div className="flex-1 bg-background p-10 rounded-[2.5rem] shadow-2xl space-y-6">
                        <div className="space-y-1">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Текущая активность</p>
                            <p className="text-4xl font-black">2,481</p>
                            <p className="text-sm text-muted-foreground">Покупателей ищут жилье прямо сейчас</p>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[75%] rounded-full" />
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            * Обновлено 10 минут назад по Карагандинской области
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container text-center py-20 bg-primary rounded-[4rem] text-primary-foreground shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] mx-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
                    Готовы найти <br/> своего покупателя?
                </h2>
                <Button asChild size="lg" variant="secondary" className="h-16 px-12 rounded-2xl text-xl font-black uppercase shadow-2xl">
                    <Link href={email ? "/dashboard/objects/add" : "/login"}>Создать объявление</Link>
                </Button>
            </section>
        </div>
    );
}