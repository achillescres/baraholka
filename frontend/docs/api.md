# API Документация

## Аутентификация

### POST /api/auth/login
Авторизация пользователя.

**Тело запроса:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Ответ:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "username": "string"
  }
}
```

### POST /api/auth/register
Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string"
}
```

**Ответ:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "username": "string"
  }
}
```

## Товары

### GET /api/products
Получение списка всех товаров.

**Параметры запроса:**
- `search` (опционально) - поиск по названию
- `category` (опционально) - фильтр по категории
- `condition` (опционально) - фильтр по состоянию
- `minPrice` (опционально) - минимальная цена
- `maxPrice` (опционально) - максимальная цена
- `sortBy` (опционально) - сортировка (newest, oldest, price_asc, price_desc)

**Ответ:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "string",
    "category": "string",
    "condition": "string",
    "images": ["string"],
    "userId": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### GET /api/products/:id
Получение информации о конкретном товаре.

**Параметры пути:**
- `id` - ID товара

**Ответ:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "string",
  "category": "string",
  "condition": "string",
  "images": ["string"],
  "userId": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### POST /api/products
Создание нового товара.

**Требуется авторизация:** Да

**Тело запроса (FormData):**
- `title` - название товара
- `description` - описание товара
- `price` - цена
- `category` - категория
- `condition` - состояние
- `image0`, `image1`, ... - изображения (до 5 штук)

**Ответ:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "string",
  "category": "string",
  "condition": "string",
  "images": ["string"],
  "userId": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### DELETE /api/products/:id
Удаление товара.

**Требуется авторизация:** Да

**Параметры пути:**
- `id` - ID товара

**Ответ:**
```json
{
  "success": true
}
```

## Пользователи

### GET /api/users/:id
Получение информации о пользователе.

**Параметры пути:**
- `id` - ID пользователя

**Ответ:**
```json
{
  "id": "string",
  "email": "string",
  "username": "string",
  "createdAt": "string"
}
```

## Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Типы данных

### Категории товаров
- Электроника
- Одежда
- Книги
- Спорт
- Другое

### Состояния товаров
- Новое
- Как новое
- Б/у

### Сортировка
- `newest` - сначала новые
- `oldest` - сначала старые
- `price_asc` - по возрастанию цены
- `price_desc` - по убыванию цены 