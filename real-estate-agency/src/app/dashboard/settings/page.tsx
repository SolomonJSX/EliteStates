"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Lock, Bell, Palette, Globe, 
    ShieldCheck, Moon, Sun, Laptop,
    Loader2, Save
} from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { data: profile } = useProfile();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Имитация смены пароля
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Пароль успешно обновлен");
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="space-y-1">
                <h1 className="text-3xl font-black uppercase tracking-tight">Настройки</h1>
                <p className="text-muted-foreground font-medium">Управление безопасностью и предпочтениями вашего аккаунта.</p>
            </div>

            <Tabs defaultValue="security" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-12 w-full justify-start md:w-fit">
                    <TabsTrigger value="security" className="rounded-xl px-6 gap-2">
                        <Lock className="h-4 w-4" /> Безопасность
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-xl px-6 gap-2">
                        <Palette className="h-4 w-4" /> Внешний вид
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 gap-2">
                        <Bell className="h-4 w-4" /> Уведомления
                    </TabsTrigger>
                </TabsList>

                {/* --- БЕЗОПАСНОСТЬ --- */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <CardTitle className="uppercase text-sm tracking-widest">Смена пароля</CardTitle>
                            <CardDescription>Рекомендуем использовать сложный пароль, состоящий из букв, цифр и символов.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveSecurity} className="space-y-6">
                                <div className="grid gap-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Текущий пароль</Label>
                                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/20 border-none px-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Новый пароль</Label>
                                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/20 border-none px-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Подтверждение</Label>
                                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/20 border-none px-4" />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSaving} className="rounded-xl font-bold gap-2 h-11 px-8">
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Обновить пароль
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50 bg-destructive/5 border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive uppercase text-sm tracking-widest">Двухфакторная аутентификация</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="font-bold">Защита через SMS или приложение</p>
                                <p className="text-xs text-muted-foreground">Дополнительный уровень безопасности при входе.</p>
                            </div>
                            <Switch />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ВНЕШНИЙ ВИД --- */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <CardTitle className="uppercase text-sm tracking-widest">Тема оформления</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ThemeCard icon={<Sun />} label="Светлая" active />
                            <ThemeCard icon={<Moon />} label="Темная" />
                            <ThemeCard icon={<Laptop />} label="Системная" />
                        </CardContent>
                    </Card>
                    
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                        <CardContent className="flex items-center justify-between p-8">
                            <div className="space-y-0.5">
                                <p className="font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
                                    <Globe className="h-4 w-4 text-primary" /> Язык интерфейса
                                </p>
                            </div>
                            <select className="bg-muted/50 rounded-xl px-4 py-2 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-primary">
                                <option>Русский</option>
                                <option>Қазақша</option>
                                <option>English</option>
                            </select>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- УВЕДОМЛЕНИЯ --- */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <CardTitle className="uppercase text-sm tracking-widest">E-mail уведомления</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ToggleItem title="Новые объекты" description="Получать письма о недвижимости по вашим фильтрам." />
                            <ToggleItem title="Статус сделок" description="Уведомления об этапах подписания контракта." />
                            <ToggleItem title="Маркетинг" description="Новости рынка недвижимости и акции EliteStates." defaultChecked={false} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Вспомогательные компоненты для страницы настроек
function ToggleItem({ title, description, defaultChecked = true }: { title: string, description: string, defaultChecked?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="font-bold text-sm uppercase tracking-tight">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch defaultChecked={defaultChecked} />
        </div>
    );
}

function ThemeCard({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={cn(
            "p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 cursor-pointer transition-all hover:bg-accent",
            active ? "border-primary bg-primary/5" : "border-transparent bg-muted/20"
        )}>
            <div className={cn("p-3 rounded-2xl", active ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                {icon}
            </div>
            <span className="font-black uppercase text-[10px] tracking-widest">{label}</span>
        </div>
    );
}