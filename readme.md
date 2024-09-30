=========
Так как у меня появились технические проблемы с докером(контейнеры не хотели останавливаться и докер работал нестабильно)
лучше запускать приложение через npm run dev
========

Соберите и запустите контейнеры:
docker-compose up -d --build

Проверьте статус контейнеров:
docker-compose ps

Остановка контейнеров
docker-compose down

Доступ к сервисам:

Provider API: http://localhost:3000
Bet-platform API: http://localhost:4000

Swagger-документация доступна по адресам:

Provider Swagger UI: http://localhost:3000/documentation
Bet-platform Swagger UI: http://localhost:4000/documentation
