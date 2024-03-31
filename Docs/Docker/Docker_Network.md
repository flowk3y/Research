# Default network drivers on Docker
There are 3 basic type of network on docker network: Bridge, None, Host

## None
Completely isolate a container from the host and other containers.

## Host
Remove network isolation between the container and the Docker host, and use the host's networking directly.

## Bridge
The default network driver. If you don't specify a driver, this is the type of network you are creating. Bridge networks are commonly used when your application runs in a container that needs to communicate with other containers on the same host.

## User-define network

Let's create a new network name my-ecommerce-network

```sh
docker network create -d bridge my-ecommerce-network
```

## Use docker compose to create a network and config them together

```yml
version: "3.8"
services:
  db:
    image: postgres:latest
    container_name: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    env_file:
      - .env
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      mynet:
        ipv4_address: 192.168.48.10
    restart: always

  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/code
    networks:
      mynet:
        ipv4_address: 192.168.48.6
    command: echo "cham hoi cham hoi"
    depends_on:
      - db
    tty: true

volumes:
  db-data:

networks:
  mynet:
    ipam:
      driver: default
      config:
        - subnet: "192.168.48.0/20"

```

Show all network
```sh
docker network ls
```

Inspect docker network
```sh
docker network inspect <name-of-network>
```