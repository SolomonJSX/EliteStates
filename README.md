# 🏙️ EliteStates — Premium Real Estate Management System

![Banner](https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop)

[![Framework](https://img.shields.io/badge/.NET-8.0-512bd4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/SQL_Server-2022-red?style=for-the-badge&logo=microsoftsqlserver)](https://www.microsoft.com/en-us/sql-server/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

**EliteStates** — это высокотехнологичная ERP-система для агентств недвижимости, разработанная для автоматизации полного цикла сделок: от публикации объекта до регистрации финального платежа и формирования аналитической отчетности.

---

## 🚀 Основные возможности

### 🔐 Ролевая модель доступа (RBAC)
* **Администратор:** Управление персоналом, полный доступ к финансовой аналитике и модерации.
* **Сотрудник (Агент):** Регистрация объектов, оформление контрактов (купля-продажа/аренда), ведение кассы платежей.
* **Клиент:** Личный кабинет с историей сделок, документами и списком своих объектов.

### 💼 Бизнес-логика
* **Smart Listing:** Динамический каталог с фильтрацией по районам (Караганда), типам недвижимости и ценовым диапазонам.
* **Contract Lifecycle:** Автоматическая смена статусов объектов (`Active` -> `Sold`/`Rented`) при подписании договора.
* **Payment Tracking:** Система учета входящих платежей, привязанных к конкретным контрактам.
* **Business Intelligence:** Модуль отчетов (доходы по сотрудникам, популярность районов, типы операций за год).

---

## 🛠 Технологический стек

### **Backend**
* **Core:** .NET 8 (C#)
* **Architecture:** Clean Architecture + CQRS (MediatR)
* **ORM:** Entity Framework Core (Code First)
* **Security:** JWT Authentication & Identity Framework
* **Database:** Microsoft SQL Server

### **Frontend**
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Shadcn UI
* **State Management:** TanStack Query v5 + Zustand
* **Forms:** TanStack Form (React Form)
* **Icons:** Lucide React

---

## 🏗 Архитектура решения

Проект реализован с использованием **Clean Architecture**, что разделяет ответственности на 4 уровня:
1.  **Domain:** Чистые сущности и бизнес-правила.
2.  **Application:** Команды и запросы (Commands/Queries), валидация и DTO.
3.  **Infrastructure:** Реализация БД, репозиториев и внешних сервисов.
4.  **Presentation:** RESTful Web API и клиентская часть на Next.js.

---

## 📦 Быстрый старт

### 1. Требования
* .NET 8.0 SDK
* Node.js 18+
* MS SQL Server LocalDB или экземпляр сервера

### 2. Запуск Backend
```bash
cd RealEstateAgency.Api
dotnet ef database update
dotnet run
