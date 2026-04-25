"use client";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { contractsApi } from "@/api/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Briefcase, Building2, User,
    Calendar, ArrowLeft, Loader2, Info
} from "lucide-react";

export default function NewContractPage() {
    const router = useRouter();

    // Загрузка данных для выбора
    const { data: objects, isLoading: isObjLoading } = useQuery({
        queryKey: ["active-objects"],
        queryFn: contractsApi.getActiveObjects
    });

    const { data: clients, isLoading: isClientsLoading } = useQuery({
        queryKey: ["all-clients"],
        queryFn: contractsApi.getClients
    });

    const form = useForm({
        defaultValues: {
            realEstateObjectId: "",
            clientId: "",
            operationTypeId: "1", // По умолчанию Продажа
            durationMonths: "0",
            note: ""
        },
        onSubmit: async ({ value }) => {
            try {
                await contractsApi.create({
                    realEstateObjectId: Number(value.realEstateObjectId),
                    clientId: Number(value.clientId),
                    operationTypeId: Number(value.operationTypeId),
                    durationMonths: Number(value.durationMonths),
                    note: value.note
                });
                toast.success("Сделка успешно оформлена!");
                router.push("/dashboard/contracts");
            } catch (error) {
                toast.error("Не удалось оформить контракт");
            }
        }
    });

    if (isObjLoading || isClientsLoading) return (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Новая сделка</h1>
                    <p className="text-muted-foreground text-sm">Оформление договора купли-продажи или аренды</p>
                </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">

                {/* 1. ВЫБОР ОБЪЕКТА */}
                <Card className="rounded-3xl border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" /> Объект недвижимости
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form.Field name="realEstateObjectId">
                            {(field) => (
                                <div className="space-y-2">
                                    <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Выберите доступный объект</FieldLabel>
                                    <Select onValueChange={field.handleChange} value={field.state.value}>
                                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none">
                                            <SelectValue placeholder="Поиск объекта по адресу..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            {objects?.map((obj: any) => (
                                                <SelectItem key={obj.id} value={obj.id.toString()}>
                                                    {obj.title} ({obj.price.toLocaleString()} ₸)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>
                    </CardContent>
                </Card>

                {/* 2. ВЫБОР КЛИЕНТА */}
                <Card className="rounded-3xl border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> Клиент (Покупатель/Арендатор)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <form.Field name="clientId">
                            {(field) => (
                                <div className="space-y-2">
                                    <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                        Клиент из базы
                                    </FieldLabel>
                                    <Select onValueChange={field.handleChange} value={field.state.value}>
                                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none">
                                            <SelectValue placeholder={isClientsLoading ? "Загрузка..." : "Выберите клиента"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            {clients && clients.length > 0 ? (
                                                clients.map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id.toString()}>
                                                        {c.lastName} {c.firstName}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">
                                                    Клиенты не найдены. <br />
                                                    <span className="text-[10px]">Проверьте таблицу Clients в БД</span>
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="operationTypeId">
                            {(field) => (
                                <div className="space-y-2">
                                    <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Тип сделки</FieldLabel>
                                    <Select onValueChange={field.handleChange} value={field.state.value}>
                                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="1">Продажа</SelectItem>
                                            <SelectItem value="2">Аренда</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>
                    </CardContent>
                </Card>

                {/* 3. ДЕТАЛИ СДЕЛКИ */}
                <Card className="rounded-3xl border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" /> Условия контракта
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form.Field name="durationMonths">
                            {(field) => (
                                <div className="space-y-2">
                                    <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Срок действия (в месяцах, 0 для бессрочного)</FieldLabel>
                                    <Input
                                        type="number"
                                        className="h-12 rounded-2xl bg-muted/30 border-none"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="note">
                            {(field) => (
                                <div className="space-y-2">
                                    <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Дополнительные примечания</FieldLabel>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                                        placeholder="Особые условия, график платежей..."
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        </form.Field>
                    </CardContent>
                </Card>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3 items-start">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        После сохранения сделки статус объекта недвижимости автоматически изменится на <span className="font-bold text-foreground">"Продано"</span> или <span className="font-bold text-foreground">"Аренда"</span>, и он перестанет отображаться в общем каталоге.
                    </p>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                    Подписать и зарегистрировать контракт
                </Button>
            </form>
        </div>
    );
}