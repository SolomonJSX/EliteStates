import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export const registerSchema = z.object({
    firstName: z.string().min(2, "Имя слишком короткое"),
    lastName: z.string().min(2, "Фамилия слишком короткая"),
    email: z.string().email("Некорректный email"),
    phone: z.string().min(10, "Введите корректный номер телефона"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string().min(6, "Подтвердите пароль"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"], // Ошибка будет указывать на это поле
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
