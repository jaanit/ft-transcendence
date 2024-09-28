#!/bin/sh
echo "DATABASE HOST db"
echo "POSTGRES USER user"

until pg_isready -h db -p 5432 -U user
do
    echo "Waiting for postgres..."
    sleep 1
done

npm install && npm run build 
npx prisma migrate dev --name dev --preview-feature
exec "$@"
