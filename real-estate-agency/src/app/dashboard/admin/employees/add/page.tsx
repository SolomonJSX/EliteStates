"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminApi } from "@/api/admin"; // Импортируем новый API
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, Camera, Loader2 } from "lucide-react";

export default function AddEmployeePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Очистка памяти при закрытии компонента
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
            position: "",
        },
        onSubmit: async ({ value }) => {
            setIsSubmitting(true);
            try {
                await adminApi.registerEmployee(value, avatarFile);
                toast.success("Сотрудник успешно зарегистрирован");
                router.push("/dashboard/admin");
            } catch (error) {
                toast.error("Ошибка при регистрации сотрудника");
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-4 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Назад к списку
            </Button>

            <Card className="border-2 shadow-sm">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Регистрация нового сотрудника
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
                        
                        {/* Секция Фотографии */}
                        <div className="flex flex-col items-center justify-center space-y-3 pb-4">
                            <div 
                                className="relative group cursor-pointer" 
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                                    <AvatarImage src={avatarPreview || ""} className="object-cover" />
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        <Camera className="h-8 w-8 opacity-50" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-6 w-6 mb-1" />
                                    <span className="text-[10px] font-medium">Загрузить</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Фотография профиля сотрудника (необязательно)</p>
                        </div>

                        {/* Текстовые поля */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <form.Field name="firstName">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Имя</FieldLabel>
                                        <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                    </Field>
                                )}
                            </form.Field>
                            <form.Field name="lastName">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Фамилия</FieldLabel>
                                        <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <form.Field name="email">
                            {(field) => (
                                <Field>
                                    <FieldLabel>Email (Используется для входа)</FieldLabel>
                                    <Input type="email" placeholder="agent@elitestates.kz" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </Field>
                            )}
                        </form.Field>

                        <form.Field name="password">
                            {(field) => (
                                <Field>
                                    <FieldLabel>Временный пароль</FieldLabel>
                                    <Input type="password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </Field>
                            )}
                        </form.Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                            <form.Field name="phone">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Телефон</FieldLabel>
                                        <Input placeholder="+7 (___) ___ __ __" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="position">
                                {(field) => (
                                    <Field>
                                        <FieldLabel>Должность</FieldLabel>
                                        <Input placeholder="Старший риелтор" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                    </Field>
                                )}
                            </form.Field>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base mt-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Создание учетной записи...
                                </>
                            ) : (
                                "Зарегистрировать сотрудника"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}