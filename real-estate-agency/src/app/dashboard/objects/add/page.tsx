"use client";

import { useState, useRef, useEffect } from "react";
import { useLookups } from "@/hooks/use-lookups";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ImagePlus,
  X,
  Loader2,
  Home,
  Banknote,
  Maximize,
  FileText,
} from "lucide-react";

export default function AddObjectPage() {
  const { data: lookups, isLoading } = useLookups();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;

    const arr = Array.from(list);
    setFiles((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const form = useForm({
    defaultValues: {
      propertyTypeId: "",
      districtId: "",
      street: "",
      houseNumber: "",
      apartmentNumber: "",
      price: "",
      area: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      if (!files.length) {
        toast.error("Добавь хотя бы 1 фото");
        return;
      }

      try {
        setLoading(true);

        const { data } = await api.post("/objects", {
          ...value,
          propertyTypeId: +value.propertyTypeId,
          districtId: +value.districtId,
          price: +value.price,
          area: +value.area,
          apartmentNumber: value.apartmentNumber
            ? +value.apartmentNumber
            : null,
        });

        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));

        await api.post(`/objects/${data.id}/photos`, fd);

        toast.success("Готово 🚀");
        router.push("/dashboard/objects");
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Ошибка");
      } finally {
        setLoading(false);
      }
    },
  });

  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Новое объявление</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* PHOTOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2">
              <ImagePlus /> Фото
            </CardTitle>
            <CardDescription>
              Первое фото будет обложкой
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previews.map((src, i) => (
              <div key={src} className="relative group">
                <img
                  src={src}
                  className="rounded-md object-cover w-full h-28"
                />

                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-dashed border flex items-center justify-center h-28 rounded-md"
            >
              <ImagePlus />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </CardContent>
        </Card>

        {/* MAIN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2">
              <Home /> Характеристики
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["propertyTypeId", "Тип"],
                ["districtId", "Район"],
              ].map(([name, label]) => (
                <form.Field key={name} name={name as any}>
                  {(f) => (
                    <Field>
                      <FieldLabel>{label}</FieldLabel>
                      <Select
                        value={f.state.value}
                        onValueChange={f.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выбрать" />
                        </SelectTrigger>
                        <SelectContent>
                          {(name === "propertyTypeId"
                            ? lookups?.propertyTypes
                            : lookups?.districts
                          )?.map((x) => (
                            <SelectItem key={x.id} value={String(x.id)}>
                              {x.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["street", "Улица"],
                ["houseNumber", "Дом"],
                ["apartmentNumber", "Кв"],
              ].map(([name, label]) => (
                <form.Field key={name} name={name as any}>
                  {(f) => (
                    <Field>
                      <FieldLabel>{label}</FieldLabel>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="price">
                {(f) => (
                  <Field>
                    <FieldLabel className="flex gap-1">
                      <Banknote size={14} /> Цена
                    </FieldLabel>
                    <Input
                      type="number"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="area">
                {(f) => (
                  <Field>
                    <FieldLabel className="flex gap-1">
                      <Maximize size={14} /> Площадь
                    </FieldLabel>
                    <Input
                      type="number"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(f) => (
                <Field>
                  <FieldLabel className="flex gap-1">
                    <FileText size={14} /> Описание
                  </FieldLabel>
                  <textarea
                    className="border rounded-md p-2 min-h-[100px]"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Назад
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Создать"}
          </Button>
        </div>
      </form>
    </div>
  );
}
