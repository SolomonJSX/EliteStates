"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { objectsApi } from "@/api/objects";
import { useLookups } from "@/hooks/use-lookups";
import { getImageUrl } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
    Search, MapPin, Maximize2, 
    Filter, Loader2, Home, 
    ChevronLeft, ChevronRight, SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BuyPage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        propertyTypeId: "",
        districtId: "",
        minPrice: "",
        maxPrice: "",
    });

    // Загрузка данных каталога
    const { data, isLoading } = useQuery({
        queryKey: ["listing", page, filters],
        queryFn: () => objectsApi.getListing({ 
            page, 
            pageSize: 9, 
            ...filters,
            propertyTypeId: filters.propertyTypeId ? Number(filters.propertyTypeId) : undefined,
            districtId: filters.districtId ? Number(filters.districtId) : undefined,
        }),
    });

    const { data: lookups } = useLookups();

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight uppercase">Недвижимость в Караганде</h1>
                <p className="text-muted-foreground text-lg">Найдите идеальное место для жизни среди проверенных объявлений.</p>
            </div>

            {/* Filters Bar */}
            <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl p-4 rounded-[2.5rem] border shadow-xl flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                    <Select 
                        value={filters.propertyTypeId} 
                        onValueChange={(v) => setFilters(f => ({...f, propertyTypeId: v}))}
                    >
                        <SelectTrigger className="rounded-full border-none bg-muted/50 h-12">
                            <Home className="h-4 w-4 mr-2 text-primary" />
                            <SelectValue placeholder="Тип жилья" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value=" ">Все типы</SelectItem>
                            {lookups?.propertyTypes.map(t => (
                                <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <Select 
                        value={filters.districtId} 
                        onValueChange={(v) => setFilters(f => ({...f, districtId: v}))}
                    >
                        <SelectTrigger className="rounded-full border-none bg-muted/50 h-12">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <SelectValue placeholder="Район" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value=" ">Все районы</SelectItem>
                            {lookups?.districts.map(d => (
                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-muted/50 rounded-full px-4 h-12">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Цена</span>
                    <Input 
                        placeholder="От" 
                        type="number"
                        className="w-24 border-none bg-transparent h-8 focus-visible:ring-0" 
                        value={filters.minPrice}
                        onChange={(e) => setFilters(f => ({...f, minPrice: e.target.value}))}
                    />
                    <div className="h-4 w-[1px] bg-border" />
                    <Input 
                        placeholder="До" 
                        type="number"
                        className="w-24 border-none bg-transparent h-8 focus-visible:ring-0" 
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(f => ({...f, maxPrice: e.target.value}))}
                    />
                </div>

                <Button 
                    className="rounded-full h-12 px-8 font-bold shadow-lg shadow-primary/20"
                >
                    Найти <Search className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="aspect-[4/3] bg-muted rounded-[2rem]" />
                            <div className="h-6 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data?.items.map((obj: any) => (
                            <Link key={obj.id} href={`/listing/${obj.id}`} className="group">
                                <Card className="border-none bg-card shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group-hover:-translate-y-2">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img 
                                            src={getImageUrl(obj.mainPhotoUrl)} 
                                            alt={obj.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-md text-foreground border-none font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            {obj.propertyTypeName}
                                        </Badge>
                                        <div className="absolute bottom-4 left-4">
                                            <div className="bg-primary/90 backdrop-blur-md text-white text-xl font-black px-4 py-2 rounded-2xl shadow-xl">
                                                {obj.price.toLocaleString()} ₸
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 space-y-3">
                                        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                            {obj.districtName} район, {obj.street}
                                        </h3>
                                        <div className="flex items-center gap-4 text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Maximize2 className="h-4 w-4 text-primary" /> {obj.area} м²
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-primary" /> {obj.districtName}
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-6 pb-6 pt-0">
                                        <Button className="w-full rounded-2xl font-bold bg-muted text-foreground hover:bg-primary hover:text-white transition-all h-11 border-none">
                                            Подробнее
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 py-12">
                        <Button 
                            variant="outline" 
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-2xl h-12 w-12 p-0"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="font-black text-lg w-8 text-center">{page}</span>
                        <Button 
                            variant="outline" 
                            disabled={data?.items.length < 9} 
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-2xl h-12 w-12 p-0"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}