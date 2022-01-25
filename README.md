# Cinect

## Development

### General

Spin up the development environment

    docker-compose up


If you made changes to config files (e.g. package.json, docker-compose.yml, Dockerfile) you may have to restart the services and delete images & volumes:

    docker-compose down --rmi all --volumes

And then again start the services with `docker-compose up`.

Note: In case of **emergency** use `docker system prune --all --volumes` to basically *factory reset* your Docker.

Note: You can also start single service with `docker-compose up <service-name>`.
