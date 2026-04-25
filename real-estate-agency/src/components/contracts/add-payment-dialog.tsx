"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/axios";
import { 
    Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Banknote, Loader2 } from "lucide-react";

export function AddPaymentDialog({ 
    contractId, 
    isOpen, 
    onClose, 
    onSuccess 
}: { 
    contractId: number, 
    isOpen: boolean, 
    onClose: () => void,
    onSuccess: () => void
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            amount: "",
            paymentDate: new Date().toISOString().split('T')[0]
        },
        onSubmit: async ({ value }) => {
            setIsSubmitting(true);
            try {
                await api.post("/payments", {
                    contractId,
                    amount: Number(value.amount),
                    paymentDate: value.paymentDate
                });
                toast.success("Платеж успешно зарегистрирован");
                onSuccess();
                onClose();
            } catch {
                toast.error("Ошибка при проведении платежа");
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-3xl sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-primary" /> Регистрация оплаты
                    </DialogTitle>
                    <DialogDescription>
                        Введите сумму платежа по контракту #{contractId}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4 py-4">
                    <form.Field name="amount">
                        {(field) => (
                            <div className="space-y-2">
                                <FieldLabel>Сумма (₸)</FieldLabel>
                                <Input 
                                    type="number" 
                                    placeholder="500 000"
                                    className="h-12 rounded-xl"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="paymentDate">
                        {(field) => (
                            <div className="space-y-2">
                                <FieldLabel>Дата платежа</FieldLabel>
                                <Input 
                                    type="date"
                                    className="h-12 rounded-xl"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>

                    <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Подтвердить оплату"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}