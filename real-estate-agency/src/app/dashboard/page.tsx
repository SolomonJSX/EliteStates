import { redirect } from "next/navigation";

export default function DashboardPage() {
    // Перенаправляем пользователя на профиль по умолчанию
    redirect("/dashboard/profile");
}