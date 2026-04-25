"use client";

import { useQuery } from "@tanstack/react-query";
import { objectsApi } from "@/api/objects";
import { getImageUrl } from "@/lib/config";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ObjectDetailsPage() {
  const { id } = useParams();
  const objectId = Number(id);

  const [index, setIndex] = useState(0);

  const { data: obj, isLoading } = useQuery({
    queryKey: ["object", objectId],
    queryFn: () => objectsApi.getById(objectId),
    enabled: !!objectId,
  });

  const photos = obj?.photos ?? [];

  const current = useMemo(
    () => getImageUrl(photos[index] || ""),
    [photos, index]
  );

  const prev = () =>
    setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));

  const next = () =>
    setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!photos.length) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length]);

  if (isLoading)
    return (
      <div className="flex h-52 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  if (!obj)
    return (
      <div className="text-center py-24 text-lg font-semibold">
        Объект не найден
      </div>
    );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {obj.propertyTypeName}
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {obj.street}, {obj.houseNumber}
            {obj.apartmentNumber && ` • кв. ${obj.apartmentNumber}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-3">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 px-3">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* GALLERY */}
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden border bg-muted/30 group">
              <img
                src={current}
                className="w-full h-full object-contain"
              />

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((p: string, i: number) => (
                  <img
                    key={i}
                    src={getImageUrl(p)}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-14 w-20 shrink-0 rounded-md object-cover cursor-pointer transition",
                      i === index
                        ? "ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              ["Цена", obj.price.toLocaleString() + " ₸"],
              ["Площадь", obj.area + " м²"],
              ["Тип", obj.propertyTypeName],
            ].map(([label, val]) => (
              <div
                key={label}
                className="rounded-xl border bg-card px-4 py-3 space-y-1"
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="font-semibold">{val}</p>
              </div>
            ))}

            <div className="rounded-xl border bg-card px-4 py-3 space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Статус
              </p>
              <Badge className="mt-1">{obj.status}</Badge>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Описание</h2>
            <div className="rounded-xl border bg-muted/30 px-4 py-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {obj.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="sticky top-24 rounded-2xl border bg-card px-5 py-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Контакт</p>
                <p className="font-semibold">{obj.ownerName}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button className="w-full h-11 gap-2">
                <Phone className="h-4 w-4" /> {obj.ownerPhone}
              </Button>

              <Button variant="outline" className="w-full h-10">
                Написать сообщение
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
