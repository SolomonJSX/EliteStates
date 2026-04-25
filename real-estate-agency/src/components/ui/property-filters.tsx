"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLookups } from "@/hooks/use-lookups";
import { X, Search } from "lucide-react";

interface FiltersProps {
    filters: any;
    setFilters: (filters: any) => void;
    onReset: () => void;
}

export function PropertyFilters({ filters, setFilters, onReset }: FiltersProps) {
    const { data: lookups } = useLookups();

    const handleSelectChange = (name: string, value: string) => {
        setFilters({ ...filters, [name]: value === "all" ? null : value });
    };

    const handleInputChange = (name: string, value: string) => {
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-card p-6 rounded-2xl border shadow-sm">
            {/* Тип недвижимости */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Тип</label>
                <Select value={filters.propertyTypeId || "all"} onValueChange={(v) => handleSelectChange("propertyTypeId", v)}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Все типы" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        {lookups?.propertyTypes.map(t => (
                            <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Район */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Район</label>
                <Select value={filters.districtId || "all"} onValueChange={(v) => handleSelectChange("districtId", v)}>
                    <SelectTrigger className="h-11">
                        <SelectValue placeholder="Любой район" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Любой район</SelectItem>
                        {lookups?.districts.map(d => (
                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Цена ОТ */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Цена от</label>
                <Input
                    type="number"
                    placeholder="0 ₸"
                    className="h-11"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleInputChange("minPrice", e.target.value)}
                />
            </div>

            {/* Цена ДО */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Цена до</label>
                <Input
                    type="number"
                    placeholder="999 999 999 ₸"
                    className="h-11"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                />
            </div>

            {/* Кнопка сброса */}
            <div className="flex items-end pb-0.5">
                <Button
                    variant="outline"
                    className="w-full h-11 gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={onReset}
                >
                    <X className="h-4 w-4" />
                    Сбросить
                </Button>
            </div>
        </div>
    );
}