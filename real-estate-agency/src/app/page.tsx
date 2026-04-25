import Image from "next/image";
import Hero from "@/components/sections/hero";

export default function Home() {
  return (
      <>
        <Hero />
        {/* Здесь позже будут секции "Популярные объекты", "Наши услуги" и т.д. */}
        <section className="container py-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Почему выбирают EliteStates?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Карточки преимуществ */}
            <div className="p-6 border rounded-xl bg-card">
              <h3 className="font-bold mb-2">Прозрачность</h3>
              <p className="text-muted-foreground text-sm">Все сделки фиксируются юридически чистыми договорами.</p>
            </div>
            <div className="p-6 border rounded-xl bg-card">
              <h3 className="font-bold mb-2">Скорость</h3>
              <p className="text-muted-foreground text-sm">Найдем покупателя или арендатора в кратчайшие сроки.</p>
            </div>
            <div className="p-6 border rounded-xl bg-card">
              <h3 className="font-bold mb-2">Поддержка</h3>
              <p className="text-muted-foreground text-sm">Наши агенты на связи 24/7 для решения ваших вопросов.</p>
            </div>
          </div>
        </section>
      </>
  );
}
