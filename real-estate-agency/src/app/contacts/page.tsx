"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import InstagramIcon from "@/components/icons/instagram";
import TwitterIcon from "@/components/icons/twitter";
import FacebookIcon from "@/components/icons/facebook";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success("Сообщение отправлено", {
            description: "Наши менеджеры свяжутся с вами в ближайшее время."
        });
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="flex flex-col gap-16 pb-20">
            {/* --- HERO SECTION --- */}
            <section className="relative py-20 bg-muted/30 overflow-hidden">
                <div className="container relative z-10 text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                        EliteStates <br /> <span className="text-primary">На связи</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Есть вопросы по объектам или хотите предложить сотрудничество? 
                        Мы всегда готовы к диалогу в нашем офисе в центре Караганды.
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            </section>

            <section className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Наши координаты</h2>
                        <div className="space-y-6">
                            <ContactItem 
                                icon={<MapPin className="h-5 w-5" />} 
                                title="Офис в Караганде" 
                                description="пр. Бухар-Жырау, 45, БЦ 'Elite', 7 этаж" 
                            />
                            <ContactItem 
                                icon={<Phone className="h-5 w-5" />} 
                                title="Телефон" 
                                description="+7 (701) 555-01-22" 
                            />
                            <ContactItem 
                                icon={<Mail className="h-5 w-5" />} 
                                title="Email" 
                                description="info@elitestates.kz" 
                            />
                            <ContactItem 
                                icon={<Clock className="h-5 w-5" />} 
                                title="Режим работы" 
                                description="Пн-Пт: 09:00 - 19:00, Сб: 10:00 - 15:00" 
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Мы в соцсетях</p>
                        <div className="flex gap-4">
                            {/* Здесь используем те иконки, что остались в Lucide */}
                            <SocialButton icon={<InstagramIcon />} />
                            <SocialButton icon={<TwitterIcon />} />
                            <SocialButton icon={<FacebookIcon />} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <Card className="rounded-[3rem] border-none shadow-2xl shadow-primary/5 p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ваше имя</label>
                                    <Input placeholder="Александр" className="h-14 rounded-2xl bg-muted/50 border-none px-6" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ваш Email</label>
                                    <Input type="email" placeholder="alex@mail.com" className="h-14 rounded-2xl bg-muted/50 border-none px-6" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Тема обращения</label>
                                <Input placeholder="Интересует объект в районе Юго-Восток" className="h-14 rounded-2xl bg-muted/50 border-none px-6" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Сообщение</label>
                                <textarea 
                                    className="flex min-h-[160px] w-full rounded-2xl border-none bg-muted/50 px-6 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all resize-none"
                                    placeholder="Расскажите, чем мы можем вам помочь..."
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full md:w-auto h-14 px-12 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Отправка..." : (
                                    <>Отправить сообщение <Send className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </form>
                    </Card>
                </div>
            </section>
        </div>
    );
}

function ContactItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                <p className="font-bold text-foreground">{description}</p>
            </div>
        </div>
    );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
    return (
        <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 hover:bg-primary hover:text-white hover:border-primary transition-all">
            {icon}
        </Button>
    );
}