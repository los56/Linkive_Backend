docker-compose build
docker save -o ./build/db.tar peachtree/linkive_database
docker save -o ./build/server.tar peachtree/linkive_backend
echo "JOBS DONE"