"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { registerSchema } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function RegisterPage() {
    const { register, isLoading } = useAuth();

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
        // Если validatorAdapter всё еще подчеркивается, попробуй обновить @tanstack/react-form
        validatorAdapter: zodValidator(),
        validators: {
            onChange: registerSchema,
        },
        onSubmit: async ({ value }) => {
            register.mutate(value);
        },
    });

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] py-10">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Регистрация клиента</CardTitle>
                    <CardDescription>Заполните данные для создания аккаунта</CardDescription>
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
                            <div className="grid grid-cols-2 gap-4">
                                <form.Field name="firstName">
                                    {(field) => {
                                        const showError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

                                        return (
                                            <Field data-invalid={showError}>
                                                <FieldLabel>Имя</FieldLabel>
                                                <Input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                                {/* Передаем ошибки только если showError == true */}
                                                <FieldError errors={showError ? field.state.meta.errors : []} />
                                            </Field>
                                        );
                                    }}
                                </form.Field>

                                <form.Field name="lastName">
                                    {(field) => {
                                        const showError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                        return (
                                        <Field data-invalid={showError}>
                                            <FieldLabel>Фамилия</FieldLabel>
                                            <Input
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                    )}}
                                </form.Field>
                            </div>

                            <form.Field name="email">
                                {(field) => (
                                    <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
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

                            <form.Field name="phone">
                                {(field) => (
                                    <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
                                        <FieldLabel>Телефон</FieldLabel>
                                        <Input
                                            placeholder="+7..."
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
                                    <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
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

                            <form.Field name="confirmPassword">
                                {(field) => (
                                    <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
                                        <FieldLabel>Подтверждение</FieldLabel>
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
                                        {isLoading || isSubmitting ? "Регистрация..." : "Создать аккаунт"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}