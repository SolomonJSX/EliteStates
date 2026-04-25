// Базовый URL бэкенда.
// В будущем его можно будет легко поменять на реальный домен через .env
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5012';

// Пути к статическим папкам на бэкенде
export const ASSETS_URLS = {
    avatars: `${API_URL}/avatars`,
    objects: `${API_URL}/objects`,
};

// Хелпер для формирования полного пути к изображению
export const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "";
    // Если путь уже полный (начинается с http), возвращаем как есть
    if (path.startsWith('http')) return path;
    // Иначе склеиваем с базовым URL
    return `${API_URL}${path}`;
};