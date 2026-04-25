"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { objectsApi } from "@/api/objects";
import { getImageUrl } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Maximize2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    LayoutGrid,
    Sparkles,
    FilterX,
    SlidersHorizontal,
    ChevronUp,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PropertyFilters } from "@/components/ui/property-filters";

// --- Компактный скелетон ---
const PropertyCardSkeleton = () => (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="relative aspect-video bg-muted/40 animate-pulse" />
        <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-muted/60 animate-pulse rounded-md" />
            <div className="space-y-2">
                <div className="h-3 w-1/2 bg-muted/60 animate-pulse rounded-md" />
                <div className="h-3 w-1/3 bg-muted/60 animate-pulse rounded-md" />
            </div>
            <div className="pt-2">
                <div className="h-8 w-full bg-muted/60 animate-pulse rounded-lg" />
            </div>
        </div>
    </div>
);

export default function ListingPage() {
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const pageSize = 12;

    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        districtId: null as string | null,
        propertyTypeId: null as string | null,
    });

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.districtId || filters.propertyTypeId;

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["listing", page, filters],
        queryFn: () => objectsApi.getListing({
            pageNumber: page,
            pageSize: pageSize,
            ...filters,
        }),
        placeholderData: (previousData) => previousData,
    });

    const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);
    const showPagination = totalPages > 1;

    const handleReset = () => {
        setFilters({ minPrice: "", maxPrice: "", districtId: null, propertyTypeId: null });
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-350 mx-auto px-4 py-8 md:py-12">

                {/* --- Header --- */}
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-1.5 bg-primary rounded-full" />
                            <h1 className="text-3xl font-bold tracking-tight">Каталог недвижимости</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Всего найдено: <span className="font-bold text-foreground">{data?.totalCount ?? 0}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={showFilters ? "default" : "outline"}
                            size="sm"
                            className="h-10 gap-2 transition-all"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Фильтры</span>
                            {hasActiveFilters && (
                                <Badge className="ml-1 h-5 w-5 justify-center rounded-full bg-white text-primary p-0">
                                    !
                                </Badge>
                            )}
                            {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                        </Button>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" className="h-10 text-muted-foreground hover:text-destructive" onClick={handleReset}>
                                <FilterX className="h-4 w-4 mr-2" /> Сбросить
                            </Button>
                        )}

                        <Button size="sm" className="h-10">
                            <Sparkles className="h-4 w-4 mr-2" /> На карте
                        </Button>
                    </div>
                </div>

                {/* --- ЖЕЛЕЗОБЕТОННОЕ СКРЫТИЕ ФИЛЬТРОВ --- */}
                {showFilters && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <PropertyFilters
                            filters={filters}
                            setFilters={(f) => { setFilters(f); setPage(1); }}
                            onReset={handleReset}
                        />
                    </div>
                )}

                <div className="relative">
                    {isFetching && !isLoading && (
                        <div className="absolute -top-12 right-0 flex items-center gap-2 text-xs text-muted-foreground z-10 bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
                            <Loader2 className="h-3 w-3 animate-spin" /> Обновление...
                        </div>
                    )}

                    {/* --- Сетка --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {isLoading
                            ? Array.from({ length: pageSize }).map((_, i) => <PropertyCardSkeleton key={i} />)
                            : data?.items.map((obj: any) => (
                                <Link
                                    href={`/listing/${obj.id}`}
                                    key={obj.id}
                                    className="group/card block h-full transform-gpu transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all">

                                        <div className="relative aspect-video overflow-hidden bg-muted/20">
                                            <img
                                                src={getImageUrl(obj.mainPhotoUrl) || "/placeholder-house.jpg"}
                                                alt={obj.title}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover/card:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                                            <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5">
                                                <Badge className="bg-primary hover:bg-primary text-white border-none text-[13px] font-bold px-2 py-0.5 shadow-sm">
                                                    {obj.price.toLocaleString()} ₸
                                                </Badge>
                                                {obj.status && (
                                                    <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none text-[9px] uppercase font-bold">
                                                        {obj.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-1 p-4 space-y-3">
                                            <h3 className="text-sm font-bold leading-tight line-clamp-1 group-hover/card:text-primary transition-colors">
                                                {obj.title}
                                            </h3>

                                            <div className="flex flex-col gap-1.5 border-b border-border/40 pb-3">
                                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                    <MapPin className="h-3 w-3 text-primary/70" />
                                                    <span className="truncate">{obj.districtName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                    <Maximize2 className="h-3 w-3 text-primary/70" />
                                                    <span>{obj.area} м²</span>
                                                </div>
                                            </div>

                                            <div className="pt-1">
                                                <div className="w-full py-1.5 rounded-md bg-secondary/40 text-center text-[11px] font-bold group-hover/card:bg-primary group-hover/card:text-white transition-all">
                                                    Подробнее
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    {!isLoading && data?.items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                                <LayoutGrid className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold">Ничего не найдено</h3>
                            <p className="text-muted-foreground max-w-xs">
                                Попробуйте изменить параметры фильтров или сбросить их.
                            </p>
                            <Button variant="link" onClick={handleReset} className="mt-2">
                                Сбросить фильтры
                            </Button>
                        </div>
                    )}
                </div>

                {/* --- Пагинация --- */}
                {showPagination && (
                    <div className="mt-16 flex justify-center">
                        <nav className="inline-flex items-center gap-1 rounded-full border bg-card p-1 shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center px-3 text-[11px] font-bold text-muted-foreground">
                                Страница {page} из {totalPages}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}