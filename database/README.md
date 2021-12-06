# Database (MongoDB)

## Dump current database state to an archive file

    mongodump --archive=init_state.dump --username=root

Or with `docker-compose` from the repository's root folder:

    docker-compose exec -T db sh -c 'mongodump --archive --username=root --password=ws21' > ./database/db.archive
