"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { objectsApi } from "@/api/objects";
import { getImageUrl } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    MapPin,
    Loader2,
    Building2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyObjectsPage() {
    const queryClient = useQueryClient();

    const { data: objects, isLoading } = useQuery({
        queryKey: ["my-objects"],
        queryFn: objectsApi.getMyObjects,
    });

    const deleteMutation = useMutation({
        mutationFn: objectsApi.deleteObject,
        onSuccess: () => {
            toast.success("Объявление удалено");
            queryClient.invalidateQueries({ queryKey: ["my-objects"] });
        },
        onError: () => toast.error("Ошибка при удалении")
    });

    const handleDelete = (id: number) => {
        if (window.confirm("Удалить это объявление?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Мои объявления</h1>
                    <p className="text-sm text-muted-foreground">Управление вашими объектами</p>
                </div>
                <Button asChild size="sm" className="gap-2">
                    <Link href="/dashboard/objects/add">
                        <Plus className="h-4 w-4" /> Добавить
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : objects?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl">
                    <Building2 className="h-10 w-10 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">У вас пока нет объявлений</p>
                </div>
            ) : (
                /* Сетка строго по 4 в ряд на десктопе */
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {objects?.map((obj: any) => (
                        <div key={obj.id} className="group flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            
                            {/* Картинка: теперь она сверху и на всю ширину карточки */}
                            <div className="relative aspect-video overflow-hidden bg-muted">
                                <img
                                    src={getImageUrl(obj.mainPhotoUrl) || "/placeholder-house.jpg"}
                                    alt={obj.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <Badge 
                                    className="absolute top-2 right-2 text-[10px]" 
                                    variant={obj.status === "Active" ? "default" : "secondary"}
                                >
                                    {obj.status}
                                </Badge>
                            </div>

                            {/* Контентная часть */}
                            <div className="p-2 lg:p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-sm line-clamp-1 mb-2">{obj.title}</h3>
                                
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{obj.districtName}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-3 border-t">
                                    <div className="text-sm font-bold text-primary">
                                        {obj.price.toLocaleString()} ₸
                                    </div>
                                    <div className="text-[11px] text-muted-foreground font-medium">
                                        {obj.area} м²
                                    </div>
                                </div>

                                {/* Кнопки управления */}
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <Button variant="outline" size="icon" className="h-8 w-full" asChild title="Смотреть">
                                        <Link href={`/listing/${obj.id}`} target="_blank">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-full" asChild title="Изменить">
                                        <Link href={`/dashboard/objects/edit/${obj.id}`}>
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="h-8 w-full" 
                                        onClick={() => handleDelete(obj.id)}
                                        disabled={deleteMutation.isPending}
                                        title="Удалить"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}