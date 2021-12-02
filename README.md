# Cinect

## Development

Spin up the development environment

    docker-compose up --build


If you made changes to config files (e.g. package.json, docker-compose.yml, Dockerfile) you may have to restart the services and delete images & volumes:

    docker-compose down
    docker volume prune
    docker images -f dangling=true

And then again start the services with `docker-compose up --build`.

Note: In case of emergency use `docker system prune -a` to basically *factory reset* your Docker.

Note: You can also start single service with `docker-compose up <service-name>`. 