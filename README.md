## Makefile commands to manage the app

1. Init swarm manager node on current machine:

`make init-swarm`

2. Init networks and volumes:

`make init-docker-env`

3. Deploy docker swarm stack (run app)

`make deploy`

4. Remove docker swarm stack (shut down app)

`make remove-stack`

5. Run load test:

`make test`
