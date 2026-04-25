"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form"; // Убрали Field отсюда
import { objectsApi } from "@/api/objects";
import { getImageUrl } from "@/lib/config";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLookups } from "@/hooks/use-lookups";
import { toast } from "sonner";
import { Loader2, ImagePlus, X, Save, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Исправленные импорты UI
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";

export default function EditObjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const { data: obj, isLoading: isObjLoading } = useQuery({
        queryKey: ["object-edit", id],
        queryFn: () => objectsApi.getById(Number(id)),
    });

    const { data: lookups } = useLookups();

    const form = useForm({
        defaultValues: {
            propertyTypeId: "",
            districtId: "",
            street: "",
            houseNumber: "",
            apartmentNumber: "",
            price: "",
            area: "",
            description: "",
        },
        onSubmit: async ({ value }) => {
            try {
                await api.put(`/objects/${id}`, {
                    ...value,
                    id: Number(id),
                    propertyTypeId: Number(value.propertyTypeId),
                    districtId: Number(value.districtId),
                    price: Number(value.price),
                    area: Number(value.area),
                    apartmentNumber: value.apartmentNumber ? Number(value.apartmentNumber) : null
                });

                if (newFiles.length > 0) {
                    const formData = new FormData();
                    newFiles.forEach(f => formData.append("files", f));
                    await api.post(`/objects/${id}/photos`, formData);
                }

                toast.success("Объявление обновлено");
                queryClient.invalidateQueries({ queryKey: ["my-objects"] });
                router.push("/dashboard/objects");
            } catch (error) {
                toast.error("Ошибка при обновлении");
            }
        },
    });

    useEffect(() => {
        if (obj) {
            form.setFieldValue("propertyTypeId", obj.propertyTypeId?.toString() || "");
            form.setFieldValue("districtId", obj.districtId?.toString() || "");
            form.setFieldValue("street", obj.street || "");
            form.setFieldValue("houseNumber", obj.houseNumber || "");
            form.setFieldValue("apartmentNumber", obj.apartmentNumber?.toString() || "");
            form.setFieldValue("price", obj.price?.toString() || "");
            form.setFieldValue("area", obj.area?.toString() || "");
            form.setFieldValue("description", obj.description || "");
        }
    }, [obj, form]);

    const deleteExistingPhoto = async (photoId: number) => {
        if (!confirm("Удалить это фото навсегда?")) return;
        try {
            await api.delete(`/objects/${id}/photos/${photoId}`);
            queryClient.invalidateQueries({ queryKey: ["object-edit", id] });
            toast.success("Фото удалено");
        } catch {
            toast.error("Не удалось удалить фото");
        }
    };

    if (isObjLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Загрузка данных объекта...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Назад
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование объекта #{id}</h1>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-8"
            >
                {/* ГАЛЕРЕЯ */}
                {/* ГАЛЕРЕЯ */}
                <Card>
                    <CardHeader>
                        <CardTitle>Фотографии объекта</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Существующие фото */}
                            {obj?.photos?.map((photo: any) => {
                                const url = getImageUrl(photo.url);
                                // Исправляем ошибку Empty Src: рендерим только если есть URL
                                if (!url) return null;

                                return (
                                    <div
                                        key={`existing-${photo.id}`} // Гарантируем уникальность ключа
                                        className="relative aspect-video rounded-xl overflow-hidden border shadow-sm group"
                                    >
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover"
                                            alt="Property"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingPhoto(photo.id)}
                                            className="absolute top-2 right-2 bg-destructive text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Новые (локальные) превью */}
                            {previews.map((url, idx) => {
                                if (!url) return null;
                                return (
                                    <div
                                        key={`new-${idx}-${url}`} // Используем индекс + url для уникальности
                                        className="relative aspect-video rounded-xl overflow-hidden border border-primary/50 shadow-sm opacity-80"
                                    >
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover"
                                            alt="New upload"
                                        />
                                        <Badge className="absolute bottom-2 left-2 text-[10px] bg-primary">Новое</Badge>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Добавь логику удаления из новых файлов, если нужно
                                                setPreviews(prev => prev.filter((_, i) => i !== idx));
                                                setNewFiles(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Кнопка добавления */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center hover:bg-accent hover:border-primary/50 text-muted-foreground transition-all"
                            >
                                <ImagePlus className="h-6 w-6" />
                                <span className="text-xs mt-2 font-medium">Добавить фото</span>
                            </button>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const files = Array.from(e.target.files);
                                    setNewFiles(prev => [...prev, ...files]);
                                    const newUrls = files.map(f => URL.createObjectURL(f));
                                    setPreviews(prev => [...prev, ...newUrls]);
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* ДАННЫЕ ОБЪЕКТА */}
                <Card>
                    <CardContent className="pt-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field name="propertyTypeId">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Тип недвижимости</FieldLabel>
                                        <Select onValueChange={field.handleChange} value={field.state.value}>
                                            <SelectTrigger className="h-12 rounded-xl px-6">
                                                <SelectValue placeholder="Выберите тип" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lookups?.propertyTypes.map(t => (
                                                    <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="districtId">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Район</FieldLabel>
                                        <Select onValueChange={field.handleChange} value={field.state.value}>
                                            <SelectTrigger className="h-12 rounded-xl px-6">
                                                <SelectValue placeholder="Выберите район" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lookups?.districts.map(d => (
                                                    <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <form.Field name="street">
                                {(field) => (
                                    <Field className="md:col-span-1">
                                        <FieldLabel>Улица</FieldLabel>
                                        <Input
                                            className="h-12 rounded-xl"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                            <form.Field name="houseNumber">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Дом</FieldLabel>
                                        <Input
                                            className="h-12 rounded-xl"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                            <form.Field name="apartmentNumber">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Квартира</FieldLabel>
                                        <Input
                                            type="number"
                                            className="h-12 rounded-xl"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field name="price">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Цена (₸)</FieldLabel>
                                        <Input
                                            type="number"
                                            className="h-12 rounded-xl font-bold text-primary"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                            <form.Field name="area">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Площадь (м²)</FieldLabel>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            className="h-12 rounded-xl"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <FieldLabel>Описание объекта</FieldLabel>
                                    <textarea
                                        className="flex min-h-60 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        </form.Field>
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full py-5 text-lg font-bold rounded-xl shadow-lg">
                    <Save className="h-5 w-5 mr-2" /> Сохранить изменения
                </Button>
            </form>
        </div>
    );
}