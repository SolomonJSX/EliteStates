"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/api/reports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
    BarChart3, PieChart, Users2, MapPin, 
    Building, Loader2, Calendar as CalendarIcon, 
    Handshake, ClipboardList, Wallet 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminReportsPage() {
    // Состояния для интерактивных отчетов
    const [selectedOpType, setSelectedOpType] = useState("1");
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [targetEmpId, setTargetEmpId] = useState("");

    // 1. Сумма прихода
    const { data: incomeData, isLoading: isIncomeLoading } = useQuery({
        queryKey: ["report-income"],
        queryFn: async () => (await reportsApi.getIncomeByEmployee()).data
    });

    // 2. Объекты по районам
    const { data: districtData, isLoading: isDistrictLoading } = useQuery({
        queryKey: ["report-districts"],
        queryFn: async () => (await reportsApi.getObjectsByDistrict()).data
    });

    // 3. Владельцы по типу операции
    const { data: ownersData, isLoading: isOwnersLoading } = useQuery({
        queryKey: ["report-owners", selectedOpType],
        queryFn: async () => (await reportsApi.getOwnersByOperation(Number(selectedOpType))).data
    });

    // 4. Финансовый отчет по дате и сотруднику
    const { data: financeData, isLoading: isFinanceLoading } = useQuery({
        queryKey: ["report-finance", reportDate, targetEmpId],
        queryFn: async () => {
            if (!targetEmpId) return null;
            return (await reportsApi.getFinancialReport(reportDate, Number(targetEmpId))).data;
        },
        enabled: !!targetEmpId
    });

    // 5. Типы недвижимости в сделках за год
    const { data: propTypeData, isLoading: isPropTypesLoading } = useQuery({
        queryKey: ["report-prop-types", selectedOpType],
        queryFn: async () => (await reportsApi.getPropertyTypesByOp(Number(selectedOpType))).data
    });

    const isLoading = isIncomeLoading || isDistrictLoading;

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Сбор данных по Караганде...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Аналитика EliteStates</h1>
                <p className="text-muted-foreground font-medium">Комплексный анализ деятельности агентства и движения объектов.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. ДОХОДЫ СОТРУДНИКОВ */}
                <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Users2 className="h-4 w-4 text-primary" /> Эффективность команды (мес.)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-muted/50">
                                    <TableHead className="text-[10px] uppercase font-bold">Сотрудник</TableHead>
                                    <TableHead className="text-right text-[10px] uppercase font-bold">Приход (₸)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incomeData?.map((item: any, i: number) => (
                                    <TableRow key={i} className="border-muted/30">
                                        <TableCell className="font-bold py-4">{item.employeeName}</TableCell>
                                        <TableCell className="text-right font-black text-primary text-lg">
                                            {item.totalAmount.toLocaleString()} ₸
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 2. ОБЪЕКТЫ ПО РАЙОНАМ */}
                <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" /> Популярность районов
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {districtData?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-muted/20 rounded-3xl border border-muted/50">
                                <span className="font-bold text-sm uppercase tracking-tight">{item.districtName}</span>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden hidden sm:block">
                                        <div className="h-full bg-primary" style={{ width: `${(item.count / 10) * 100}%` }} />
                                    </div>
                                    <Badge className="rounded-xl px-4 py-1 bg-background text-foreground border shadow-sm font-black">
                                        {item.count} объв.
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 3. ВЛАДЕЛЬЦЫ И ОПЕРАЦИИ (Динамический) */}
                <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50 lg:col-span-2">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <Handshake className="h-4 w-4 text-primary" /> Список сделок и владельцев
                            </CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase">История операций по типам</CardDescription>
                        </div>
                        <Select value={selectedOpType} onValueChange={setSelectedOpType}>
                            <SelectTrigger className="w-[200px] rounded-xl bg-muted/50 border-none h-10 font-bold text-xs uppercase">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="1">Продажа (Sold)</SelectItem>
                                <SelectItem value="2">Аренда (Rented)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-[10px] uppercase font-bold pl-6">Владелец</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold">Объект / Адрес</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Дата сделки</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isOwnersLoading ? (
                                    <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="animate-spin mx-auto h-6 w-6 opacity-20" /></TableCell></TableRow>
                                ) : ownersData?.map((item: any, i: number) => (
                                    <TableRow key={i} className="border-muted/30">
                                        <TableCell className="font-bold pl-6 py-4">{item.ownerName}</TableCell>
                                        <TableCell className="text-muted-foreground font-medium">{item.objectAddress}</TableCell>
                                        <TableCell className="text-right pr-6 font-bold">
                                            {format(new Date(item.date), "dd.MM.yyyy")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 4. ФИНАНСОВЫЙ ОТЧЕТ (По дате) */}
                <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-primary" /> Кассовый отчет (Daily)
                        </CardTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Дата</label>
                                <Input 
                                    type="date" 
                                    className="rounded-xl bg-muted/50 border-none h-10 text-xs font-bold" 
                                    value={reportDate} 
                                    onChange={(e) => setReportDate(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">ID Сотрудника</label>
                                <Input 
                                    type="number" 
                                    placeholder="Введите ID" 
                                    className="rounded-xl bg-muted/50 border-none h-10 text-xs font-bold" 
                                    value={targetEmpId}
                                    onChange={(e) => setTargetEmpId(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isFinanceLoading ? (
                            <Loader2 className="animate-spin mx-auto h-6 w-6 opacity-10" />
                        ) : financeData ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-primary text-white rounded-[2rem] shadow-xl shadow-primary/20">
                                    <p className="text-[10px] font-bold uppercase opacity-70 tracking-widest">Итог за день</p>
                                    <p className="text-3xl font-black">{financeData.totalAmount.toLocaleString()} ₸</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Детализация платежей</p>
                                    {financeData.payments.map((p: any) => (
                                        <div key={p.id} className="flex justify-between items-center p-3 border-b text-sm">
                                            <span className="font-medium text-muted-foreground">Контракт #{p.contractId}</span>
                                            <span className="font-bold">{p.amount.toLocaleString()} ₸</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center border-2 border-dashed rounded-[2rem] text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-40">
                                Введите данные для отчета
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 5. ТИПЫ НЕДВИЖИМОСТИ (Текущий год) */}
                <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-primary" /> Популярные категории ({new Date().getFullYear()})
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase">Типы объектов в успешных сделках</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {isPropTypesLoading ? (
                                <Loader2 className="animate-spin h-5 w-5 opacity-20" />
                            ) : propTypeData?.map((type: string, i: number) => (
                                <Badge key={i} className="rounded-xl px-5 py-2.5 bg-muted/50 text-foreground border-none hover:bg-primary hover:text-white transition-all cursor-default font-bold text-xs">
                                    {type}
                                </Badge>
                            ))}
                            {propTypeData?.length === 0 && <p className="text-xs text-muted-foreground font-bold uppercase">Нет данных за год</p>}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}