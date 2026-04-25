"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { objectsApi } from "@/api/objects";
import { getImageUrl } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink, MapPin, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminModerationPage() {
    const queryClient = useQueryClient();

    // Запрашиваем объекты на модерации
    const { data: pendingObjects, isLoading } = useQuery({
        queryKey: ["pending-objects"],
        queryFn: objectsApi.getPendingObjects,
    });

    // Мутация для смены статуса
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => objectsApi.changeStatus(id, status),
        onSuccess: (_, variables) => {
            const actionText = variables.status === "Active" ? "одобрено" : "отклонено";
            toast.success(`Объявление успешно ${actionText}`);
            queryClient.invalidateQueries({ queryKey: ["pending-objects"] });
        },
        onError: () => {
            toast.error("Ошибка при изменении статуса");
        }
    });

    const handleApprove = (id: number) => {
        statusMutation.mutate({ id, status: "Active" });
    };

    const handleReject = (id: number) => {
        if (window.confirm("Уверены, что хотите отклонить это объявление?")) {
            statusMutation.mutate({ id, status: "Rejected" });
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-3 border-b pb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Модерация</h1>
                    <p className="text-muted-foreground mt-1">Одобрение новых объектов недвижимости</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">Загрузка очереди...</p>
                </div>
            ) : pendingObjects?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed rounded-2xl bg-card">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold">Очередь чиста</h3>
                    <p className="text-muted-foreground mt-2">Нет новых объявлений, ожидающих проверки.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {pendingObjects?.map((obj: any) => (
                        <div key={obj.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card border rounded-2xl shadow-sm transition-all hover:shadow-md">
                            {/* Картинка */}
                            <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden shrink-0 bg-muted">
                                <img
                                    src={getImageUrl(obj.mainPhotoUrl) || "/placeholder-house.jpg"}
                                    alt={obj.title}
                                    className="w-full h-full object-cover"
                                />
                                <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm">
                                    На проверке
                                </Badge>
                            </div>

                            {/* Информация */}
                            <div className="flex flex-col flex-1 justify-between py-1">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">{obj.title}</h3>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" /> {obj.districtName}
                                        </div>
                                        <div className="font-semibold text-primary">
                                            {obj.price.toLocaleString()} ₸
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки */}
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t sm:border-none sm:pt-0">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/listing/${obj.id}`} target="_blank">
                                            <ExternalLink className="h-4 w-4 mr-2" /> Проверить
                                        </Link>
                                    </Button>

                                    <div className="ml-auto flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleReject(obj.id)}
                                            disabled={statusMutation.isPending}
                                        >
                                            <X className="h-4 w-4 mr-1" /> Отклонить
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            size="sm"
                                            onClick={() => handleApprove(obj.id)}
                                            disabled={statusMutation.isPending}
                                        >
                                            <Check className="h-4 w-4 mr-1" /> Одобрить
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}