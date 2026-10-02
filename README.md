# Business Reviews — backend

Backend сервиса «Бизнес Отзывы»: каталог организаций, отзывы и рейтинги, поиск компаний и городов, кабинет модератора и импорт сведений ЕГРЮЛ.

Проект написан на TypeScript и NestJS 8. Основные данные хранятся в PostgreSQL через Sequelize, поисковые документы — в Elasticsearch. HTTP API имеет префикс `/api`.

## Возможности

- Карточки компаний, брендов, сайтов и учебных заведений (`company`, `brand`, `site`, `school`), реквизиты и связи между организациями.
- Поиск компаний с фильтрами по городу и типу, поиск по виду деятельности, подсказки для ввода.
- Создание отзывов об имеющихся компаниях или одновременно с новой карточкой.
- Оценки от 0 до 5, подсчёт рейтинга и количества неархивных отзывов, загрузка изображений.
- Управление модераторами, редактирование, удаление и архивирование отзывов, в том числе массовые операции.
- Загрузка и обновление компаний из XML-архивов ЕГРЮЛ, генерация sitemap.

## Стек

| Компонент | Использование |
| --- | --- |
| NestJS 8 / TypeScript 4 | HTTP API, модули, валидация DTO |
| PostgreSQL / Sequelize 6 | Компании, отзывы, города, модераторы |
| Elasticsearch 7.x | Индексы `company` и `city`; в Compose указан образ 7.9.1 |
| Passport / JWT / bcryptjs | Авторизация и хеширование паролей |
| Nodemailer | Отправка временных паролей модераторам |
| NestJS Schedule | Задания импорта ЕГРЮЛ |
| Jest / Supertest | Имеющиеся unit- и e2e-тесты |

Кеш работает в памяти процесса. Подключение Redis в `AppModule` закомментировано. Методы очистки адресов DaData реализованы в `CompanyService`, но отдельный HTTP-маршрут для них закомментирован.

## Локальный запуск

Нужны Node.js и npm, доступные PostgreSQL и Elasticsearch 7.x, а также файлы сертификата ФНС. Версия Node.js не закреплена через `engines` или `.nvmrc`; Dockerfile использует `node:15-alpine`. Совместимость с другой версией следует проверить отдельно.

Выполняйте команды из корня проекта:

```sh
npm ci
```

Создайте файл окружения из шаблона. В PowerShell:

```powershell
Copy-Item .env.example .development.env
```

В Bash:

```sh
cp .env.example .development.env
```

Заполните параметры подключения и секреты. Создайте PostgreSQL-базу с именем из `POSTGRES_AUTHDATABASE` и предоставьте пользователю права на создание таблиц. Модели подключены через `autoLoadModels: true`; отдельных файлов миграций и скриптов миграции в репозитории нет.

Разместите выданные для доступа к ФНС файлы:

```text
fns-data/
  cert.crt
  privateKey.pem
```

`FnsService` читает их при загрузке модуля, поэтому без них приложение не запустится даже без ручного импорта. Пути вычисляются относительно рабочего каталога; в коде задана пустая парольная фраза ключа. Каталог `fns-data` исключён из Git.

```sh
npm run start:dev
```

После успешного старта:

- API: `http://localhost:7000/api`
- Swagger UI: `http://localhost:7000/api/docs`
- Sitemap: `http://localhost:7000/api/sitemap.xml`

Порт **7000** задан в `src/main.ts`; переменная `PORT` из окружения не используется. В development разрешён CORS для `http://localhost:3000` с credentials. Production-источники CORS и домен sitemap заданы в коде.

При инициализации `CityService` добавляет города из `src/city/data/cities.json` в верхнем регистре. Поисковые документы создаются только для новых записей городов; восстановление индекса из уже заполненной базы не реализовано.

## Переменные окружения

| Переменная | Назначение |
| --- | --- |
| `POSTGRES_HOST` | Адрес PostgreSQL |
| `POSTGRES_PORT` | Порт PostgreSQL, например `5432` |
| `POSTGRES_LOGIN` | Пользователь базы |
| `POSTGRES_PASSWORD` | Пароль пользователя базы |
| `POSTGRES_AUTHDATABASE` | Имя базы данных |
| `JWT_SECRET` | Секрет подписи JWT |
| `ELASTICSEARCH_NODE` | URL Elasticsearch, например `http://localhost:9200` |
| `ELASTICSEARCH_USERNAME` | Пользователь Elasticsearch |
| `ELASTICSEARCH_PASSWORD` | Пароль Elasticsearch |
| `REDIS_HOST`, `REDIS_PORT` | Параметры закомментированного подключения Redis |
| `EMAIL_SERVICE` | Имя почтового сервиса для Nodemailer |
| `EMAIL_USER`, `EMAIL_PASSWORD` | Учётные данные для отправки писем |
| `DADATA_API_KEY`, `DADATA_SECRET_KEY` | Ключи методов очистки адресов |

`NODE_ENV` устанавливается скриптами `start:dev`, `start` и `start:prod`. Для `start:debug` его нужно задать самостоятельно. Рабочие env-файлы исключены из Git.

## API

Все пути ниже указаны относительно `/api`. Поля запросов описаны в DTO соответствующего модуля. Swagger формируется из контроллеров и имеющихся аннотаций; детализация отдельных маршрутов может отличаться.

### Компании и города

| Метод | Путь | Назначение |
| --- | --- | --- |
| POST | `/company/create` | Создать компанию |
| GET | `/company/:id` | Получить карточку компании |
| POST | `/company/search` | Поиск: `query`, `page`, необязательные `city`, `type` |
| POST | `/company/input-search` | Подсказки: `query`, необязательные `city`, `type` |
| GET | `/company/activities` | Виды деятельности |
| GET | `/company/search/activity?activity=...&page=1` | Компании по виду деятельности |
| POST | `/company/image` | Загрузить изображение компании |
| POST | `/company/bind` | Связать компании |
| PATCH | `/company/update` | Обновить карточку |
| GET | `/city` | Получить до 100 городов |
| POST | `/city/search` | Поиск города по `query` |

Минимальные поля создания компании: `name`, `city`, `type`. Город должен существовать в базе; сервис приводит его к верхнему регистру.

Пример тела JSON для `POST /api/company/search`:

```json
{
  "query": "магазин",
  "page": 1,
  "city": "МОСКВА",
  "type": "company"
}
```

### Отзывы

| Метод | Путь | Назначение |
| --- | --- | --- |
| POST | `/review/create` | Создать отзыв для существующей компании |
| POST | `/review/create-with-company` | Создать компанию и отзыв; карточка передаётся в `company` |
| GET | `/review/get-last-reviews?page=1` | Последние неархивные отзывы, по 5 на страницу |
| GET | `/review/company/:id` | Отзывы компании |
| GET | `/review/:id` | Данные страницы отзыва |
| POST | `/review/upload-image` | Загрузить изображение отзыва |

DTO требует текст отзыва длиной 100–5000 символов и числовой рейтинг от 0 до 5. Архивные отзывы скрыты из публичной выдачи. Ошибки валидации возвращаются с HTTP 400 и массивом объектов `{ "field": "...", "errors": ["..."] }`.

Изображения отправляются через `multipart/form-data` в поле `image`. Для публичной загрузки изображения отзыва нужны поля `review_id` и `last` (строка `0` или `1`). Pipe разрешает MIME-типы JPEG, PNG и GIF. Файлы сохраняются под UUID с расширением `.jpg` без преобразования содержимого.

### Модерация и авторизация

Для первоначальной регистрации используется `POST /api/admin/register-root`:

```json
{
  "moderator_name": "Администратор",
  "email": "admin@example.com",
  "password": "replace-with-strong-password"
}
```

Сервис разрешает создать только одного root-модератора. Ответ содержит `auth_token`. Root входит с постоянным паролем. Обычный модератор сначала вызывает `POST /admin/login/email` с `email`, затем `POST /admin/login/sign` с `email` и `password`. В production временный пароль отправляется по почте и хранится в кеше 300 секунд. В остальных режимах код принимает пароль `123456` для обычного модератора.

Маршруты с `JwtAuthGuard` ожидают заголовок:

```http
Authorization: Bearer <auth_token>
```

| Метод | Путь | Назначение |
| --- | --- | --- |
| POST | `/admin/auth` | Проверить текущую учётную запись |
| POST | `/admin/register`, `/admin/delete-moderator` | Управление модераторами; сервис проверяет права root |
| POST | `/admin/search/reviews`, `/admin/search/reviews/archive` | Поиск обычных и архивных отзывов |
| DELETE | `/admin/delete-review`, `/admin/delete-review/several` | Удалить один или несколько отзывов |
| PATCH | `/admin/edit-review`, `/admin/edit-company` | Изменить отзыв или компанию |
| PATCH | `/admin/archive-review`, `/admin/archive-review/several` | Архивировать отзывы |
| PATCH | `/admin/unarchive-review`, `/admin/unarchive-review/several` | Вернуть отзывы из архива |
| POST | `/admin/company` | Получить компанию для модерации |
| POST | `/admin/unbind` | Разорвать связь компаний |
| POST | `/admin/review/upload-image`, `/admin/review/delete-images` | Управлять изображениями отзыва |
| POST | `/admin/company/upload-image`, `/admin/company/delete-image` | Управлять изображением компании |

В текущем контроллере `/admin/company/delete-image` не имеет JWT guard. `/admin/register-root` доступен без JWT, пока root ещё не создан. Публичные маршруты изменения компаний также не защищены guard. JWT-стратегия использует `ignoreExpiration: true`. Эти особенности нужно учитывать при публикации API.

## Импорт ЕГРЮЛ

`FnsService` скачивает ZIP-архивы, читает XML в Windows-1251 и передаёт сведения в сервис компаний. Полная выгрузка в коде привязана к `01.01.2021_FULL`; обновления запрашиваются за дату на два дня раньше текущей.

| Триггер | Действие |
| --- | --- |
| Cron `10 00 2 1 * *` | Полная загрузка первого числа месяца в 02:00:10 |
| Cron `5 2 * * *` | Обновление ежедневно в 02:05 |
| GET `/api/fns` | Ручная полная загрузка только в development |
| GET `/api/fns/update` | Ручное обновление только в development |
| GET `/api/fns/reset/:n` | Изменение позиции загрузки в кеше только вне development |

Часовой пояс заданий явно не указан. Cron-методы не проверяют `NODE_ENV`. Позиция импорта хранится в памяти процесса; архивы и журналы записываются в каталог `data` рядом с исполняемым модулем ФНС. В HTTPS agent отключена проверка сертификата сервера (`rejectUnauthorized: false`).

## Сборка и команды

```sh
npm run build
```

Для production создайте и заполните `.production.env`, обеспечьте доступ к PostgreSQL, Elasticsearch и файлам ФНС, затем запустите:

```sh
npm run start:prod
```

## Docker

В репозитории есть Dockerfile и Compose с backend, PostgreSQL, pgAdmin и тремя узлами Elasticsearch. Текущая конфигурация требует согласования перед запуском всего стека:

- Backend слушает `7000`, а Compose публикует `5000:5000`.
- Backend не подключён к сетям `postgres` и `elastic`, в которых находятся соответствующие сервисы.
- Compose передаёт `.production.env`, но запускает `start:dev`, который устанавливает development-режим и выбирает `.development.env`.
- Dockerfile копирует `dist`: этот каталог должен существовать в контексте сборки. Базовый образ — Node.js 15.
- Ожидания готовности Elasticsearch нет; backend зависит только от старта контейнера PostgreSQL.

Для запуска инфраструктуры отдельно от приложения:

```sh
docker compose up -d postgres pgadmin es01 es02 es03
```

Перед этим подготовьте `docker.env` с параметрами PostgreSQL и pgAdmin, проверьте каталоги томов и настройки хоста для Elasticsearch. Приложение на хосте может подключаться к `localhost:5432` и `http://localhost:9200`.

Скрипты `npm run docker-build` и `npm run docker-start` используют Bash и WSL, меняют `vm.max_map_count` и выполняют `cd ..`. Скрипт старта обращается к контейнеру `reviews-backend`, тогда как Compose задаёт имя `backend`. Для воспроизводимого запуска используйте явные команды из корня проекта после исправления конфигурации.

## Структура проекта

```text
src/
  admin/       Модераторы, JWT, операции модерации
  city/        Города, исходный справочник, поисковый индекс
  company/     Карточки компаний, поиск, связи, рейтинги
  review/      Публичные отзывы и операции над ними
  search/      Подключение Elasticsearch
  email/       Отправка писем
  files/       Сохранение и удаление изображений
  fns/         Импорт и обновление ЕГРЮЛ
  sitemap/     XML-карта сайта
  pipes/       Валидация DTO и изображений
  exceptions/  Ошибки API
  utils/       Запуск процессов через cluster
test/          Конфигурация и шаблонный e2e-тест
bash/          Скрипты Docker / WSL
```

Основные таблицы: `companies`, `reviews`, `cities`, `moderators`. Отзыв связан с компанией, компания — с городом; данные связанных компаний хранятся в JSON-массиве карточки