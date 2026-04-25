"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Plus, Download, Wallet, Handshake, 
    TrendingUp, Phone, User as UserIcon,
    ChevronLeft, ChevronRight, FileText, 
    ShieldCheck, Banknote 
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useProfile } from "@/hooks/use-user";
import { AddPaymentDialog } from "@/components/contracts/add-payment-dialog";

export default function ContractsPage() {
    const { data: profile } = useProfile();
    const queryClient = useQueryClient();
    
    // Состояния для пагинации и модалки оплаты
    const [page, setPage] = useState(1);
    const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
    const pageSize = 8;

    const isEmployee = profile?.role === "Admin" || profile?.role === "Employee";

    // Основной запрос данных
    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ["contracts", page, profile?.role],
        queryFn: async () => {
            const { data } = await api.get(`/contracts?page=${page}&pageSize=${pageSize}`);
            return data; // Ожидаем структуру { items: ContractDto[], totalCount: number }
        },
    });

    const contracts = data?.items || [];
    const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

    if (isLoading) return <LoadingSkeleton isEmployee={isEmployee} />;

    // Считаем оборот текущей страницы для KPI
    const currentPageSales = contracts.reduce((acc: number, curr: any) => acc + curr.price, 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 uppercase">
                        {isEmployee ? "Реестр сделок" : "Мои документы"}
                        {isEmployee && <Badge className="bg-primary text-white border-none rounded-full px-3">Staff</Badge>}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {isEmployee 
                            ? "Финансовый контроль и управление контрактами EliteStates" 
                            : "Ваша официальная история сделок и платежей"}
                    </p>
                </div>
                {isEmployee && (
                    <Button asChild className="rounded-2xl shadow-xl shadow-primary/20 h-12 px-6 font-bold gap-2 hover:scale-105 transition-transform">
                        <Link href="/dashboard/contracts/new">
                            <Plus className="h-5 w-5" /> Новая сделка
                        </Link>
                    </Button>
                )}
            </div>

            {/* --- KPI SECTION (Only for Staff) --- */}
            {isEmployee && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl relative overflow-hidden group">
                        <Wallet className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Оборот (стр. {page})</p>
                        <p className="text-4xl font-black mt-1">{currentPageSales.toLocaleString()} ₸</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] bg-white/20 w-fit px-3 py-1 rounded-full font-bold">
                            <TrendingUp className="h-3 w-3" /> В ПРЕДЕЛАХ НОРМЫ
                        </div>
                    </div>
                    
                    <div className="p-6 rounded-[2.5rem] bg-card border shadow-sm flex flex-col justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                            <Handshake className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Всего контрактов</p>
                            <p className="text-3xl font-black">{data?.totalCount || 0}</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-[2.5rem] bg-card border shadow-sm flex flex-col justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Статус кассы</p>
                            <p className="text-3xl font-black text-blue-600">ONLINE</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CONTRACTS TABLE --- */}
            <div className="bg-card border rounded-[2.5rem] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-muted/50">
                            <TableHead className="py-5 pl-8 text-[10px] uppercase font-bold tracking-widest">Дата</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Объект</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">
                                {isEmployee ? "Клиент" : "Агент"}
                            </TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Тип</TableHead>
                            <TableHead className="text-right pr-8 text-[10px] uppercase font-bold tracking-widest">Сумма / Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.length > 0 ? (
                            contracts.map((contract: any) => (
                                <TableRow key={contract.id} className="hover:bg-muted/10 transition-colors border-muted/20 group">
                                    <TableCell className="py-5 pl-8 font-medium text-muted-foreground">
                                        {format(new Date(contract.dateCreated), "dd.MM.yyyy")}
                                    </TableCell>
                                    <TableCell className="font-bold max-w-50 truncate">
                                        {contract.objectAddress}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold flex items-center gap-2">
                                                {isEmployee ? <UserIcon className="h-3.5 w-3.5 text-primary" /> : <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />}
                                                {isEmployee ? contract.clientName : contract.employeeName}
                                            </span>
                                            {!isEmployee && (
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                                                    <Phone className="h-2.5 w-2.5" /> {contract.agentPhone || "+7 (702) 123-4567"}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-lg px-2.5 py-0.5 font-black uppercase text-[9px] tracking-tighter">
                                            {contract.operationType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="text-lg font-black text-primary">
                                                {contract.price.toLocaleString()} ₸
                                            </span>
                                            
                                            {/* Действия: Оплата (только для персонала) и Скачивание */}
                                            <div className="flex items-center gap-1">
                                                {isEmployee && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-9 w-9 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors"
                                                        onClick={() => setSelectedContractId(contract.id)}
                                                    >
                                                        <Banknote className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <FileText className="h-16 w-16" />
                                        <p className="font-bold uppercase tracking-[0.2em] text-xs">Контракты не найдены</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* --- PAGINATION --- */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-6 border-t bg-muted/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Стр. {page} / {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-xl h-10 px-4 font-bold"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" /> Назад
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-xl h-10 px-4 font-bold"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || isPlaceholderData}
                            >
                                Вперед <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- DIALOGS --- */}
            {selectedContractId && (
                <AddPaymentDialog 
                    contractId={selectedContractId}
                    isOpen={!!selectedContractId}
                    onClose={() => setSelectedContractId(null)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["contracts"] });
                        setSelectedContractId(null);
                    }}
                />
            )}
        </div>
    );
}

// Плавная загрузка
function LoadingSkeleton({ isEmployee }: { isEmployee: boolean }) {
    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64 rounded-2xl" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
            </div>

            {isEmployee && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-[2.5rem]" />
                    ))}
                </div>
            )}

            <div className="border rounded-[2.5rem] overflow-hidden">
                <div className="bg-muted/40 h-16 w-full" />
                <div className="p-8 space-y-6">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}