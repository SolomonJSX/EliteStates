import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="font-bold text-lg mb-4">EliteStates</h3>
                        <p className="text-sm text-muted-foreground">
                            Ваш надежный партнер в мире недвижимости с 2024 года.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Навигация</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">О компании</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Политика конфиденциальности</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Контакты</h4>
                        <p className="text-sm text-muted-foreground">
                            г. Караганда, пр. Бухар-Жырау, 1<br />
                            Email: info@elitestates.kz<br />
                            Тел: +7 (777) 777-77-77
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} EliteStates Inc. Все права защищены.
                </div>
            </div>
        </footer>
    );
}