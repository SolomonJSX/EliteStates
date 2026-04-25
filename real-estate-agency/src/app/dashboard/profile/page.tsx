"use client";

import { useState, useRef } from "react";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/use-user";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Camera, Pencil, X, Check, Loader2 } from "lucide-react";
import {getImageUrl} from "@/lib/config";

// Убедись, что порт совпадает с твоим бэкендом
const API_BASE_URL = "http://localhost:5012";

export default function ProfilePage() {
    const { data: profile, isLoading } = useProfile();
    const updateMutation = useUpdateProfile();
    const uploadAvatarMutation = useUploadAvatar();
    
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Инициализация формы TanStack Form
    const form = useForm({
        defaultValues: {
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            middleName: profile?.middleName || "",
            phone: profile?.phone || "",
            city: profile?.city || "",
            street: profile?.street || "",
            house: profile?.house || "",
        },
        validatorAdapter: zodValidator(),
        onSubmit: async ({ value }) => {
            await updateMutation.mutateAsync(value);
            setIsEditing(false);
        },
    });

    // Хендлер загрузки фото
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAvatarMutation.mutateAsync(file);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Загрузка профиля...</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">Общая информация</CardTitle>
                        <CardDescription>Управление вашими персональными данными и аватаром</CardDescription>
                    </div>
                    <Button 
                        variant={isEditing ? "ghost" : "outline"} 
                        size="sm" 
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? <X className="h-4 w-4 mr-2" /> : <Pencil className="h-4 w-4 mr-2" />}
                        {isEditing ? "Отмена" : "Редактировать"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {/* Секция аватара (доступна всегда) */}
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Avatar className="h-24 w-24 border-2 border-background shadow-sm">
                                    <AvatarImage
                                        src={getImageUrl(profile?.avatarUrl)}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    {uploadAvatarMutation.isPending ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <Camera className="h-6 w-6" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{profile?.firstName} {profile?.lastName}</h3>
                                <p className="text-sm text-muted-foreground">{profile?.role} • {profile?.email}</p>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="p-0 h-auto mt-1 text-primary"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadAvatarMutation.isPending}
                                >
                                    Сменить фото профиля
                                </Button>
                            </div>
                        </div>

                        {!isEditing ? (
                            /* РЕЖИМ ПРОСМОТРА */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Контактный телефон</p>
                                    <p className="text-base font-medium">{profile?.phone || "Не указан"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Город</p>
                                    <p className="text-base font-medium">{profile?.city || "Не указан"}</p>
                                </div>
                                {profile?.role === "Client" && (
                                    <div className="md:col-span-2 space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Адрес проживания</p>
                                        <p className="text-base font-medium">
                                            {profile?.street ? `ул. ${profile.street}, дом ${profile.house || '—'}` : "Адрес не указан"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* РЕЖИМ РЕДАКТИРОВАНИЯ */
                            <form 
                                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} 
                                className="space-y-6 pt-6 border-t"
                            >
                                <FieldGroup>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <form.Field name="firstName">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel>Имя</FieldLabel>
                                                    <Input 
                                                        value={field.state.value} 
                                                        onChange={(e) => field.handleChange(e.target.value)} 
                                                    />
                                                </Field>
                                            )}
                                        </form.Field>
                                        <form.Field name="lastName">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel>Фамилия</FieldLabel>
                                                    <Input 
                                                        value={field.state.value} 
                                                        onChange={(e) => field.handleChange(e.target.value)} 
                                                    />
                                                </Field>
                                            )}
                                        </form.Field>
                                    </div>

                                    <form.Field name="phone">
                                        {(field) => (
                                            <Field>
                                                <FieldLabel>Телефон</FieldLabel>
                                                <Input 
                                                    placeholder="+7 (___) ___ __ __"
                                                    value={field.state.value} 
                                                    onChange={(e) => field.handleChange(e.target.value)} 
                                                />
                                            </Field>
                                        )}
                                    </form.Field>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <form.Field name="city">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel>Город</FieldLabel>
                                                    <Input 
                                                        value={field.state.value} 
                                                        onChange={(e) => field.handleChange(e.target.value)} 
                                                    />
                                                </Field>
                                            )}
                                        </form.Field>
                                        <form.Field name="street">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel>Улица</FieldLabel>
                                                    <Input 
                                                        value={field.state.value} 
                                                        onChange={(e) => field.handleChange(e.target.value)} 
                                                    />
                                                </Field>
                                            )}
                                        </form.Field>
                                        <form.Field name="house">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel>Дом</FieldLabel>
                                                    <Input 
                                                        value={field.state.value} 
                                                        onChange={(e) => field.handleChange(e.target.value)} 
                                                    />
                                                </Field>
                                            )}
                                        </form.Field>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Отмена
                                        </Button>
                                        <Button type="submit" disabled={updateMutation.isPending}>
                                            {updateMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4 mr-2" />
                                            )}
                                            Сохранить изменения
                                        </Button>
                                    </div>
                                </FieldGroup>
                            </form>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}