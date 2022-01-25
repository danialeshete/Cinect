# Database (MongoDB)

## Dump current database state to an archive file

    mongodump --archive=db.archive --username=root

Or with `docker-compose` from the repository's root folder:

    docker-compose exec -T db sh -c 'mongodump --archive --username=root --password=ws21' > ./database/db.archive

## Restore database on mongoDB Atlas from archive file

    mongorestore "mongodb+srv://cluster0.bhemv.mongodb.net/" --username mainuser --archive=db.archive --nsInclude='cinect.*'