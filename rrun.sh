docker system prune -a
docker volume prune
docker-compose down
docker-compose build
docker-compose up