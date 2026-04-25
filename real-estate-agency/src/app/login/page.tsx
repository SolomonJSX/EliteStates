"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { loginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import Link from "next/link";

export default function LoginPage() {
    const { login, isLoading } = useAuth();

    const form = useForm({
        defaultValues: { email: "", password: "" },
        validatorAdapter: zodValidator(),
        validators: { onChange: loginSchema },
        onSubmit: async ({ value }) => {
            login.mutate(value);
        },
    });

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-64px)]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
                    <CardDescription>Введите данные для доступа к аккаунту</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field name="email">
                                {(field) => (
                                    <Field data-invalid={field.state.meta.errors.length > 0}>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            type="email"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldError errors={field.state.meta.errors} />
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="password">
                                {(field) => (
                                    <Field data-invalid={field.state.meta.errors.length > 0}>
                                        <FieldLabel>Пароль</FieldLabel>
                                        <Input
                                            type="password"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldError errors={field.state.meta.errors} />
                                    </Field>
                                )}
                            </form.Field>

                            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                {([canSubmit, isSubmitting]) => (
                                    <Button type="submit" className="w-full" disabled={!canSubmit || isLoading}>
                                        {isLoading || isSubmitting ? "Вход..." : "Войти"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </FieldGroup>
                    </form>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Нет аккаунта?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            Зарегистрироваться
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}