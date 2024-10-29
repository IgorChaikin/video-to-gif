#!make
.PHONY: all test clean

# ******* INIT NECESSAIRY SWARM ENV BEGIN *******
init-swarm:
	@docker swarm init
init-network:
	@docker network create --scope=swarm --driver=overlay video-to-gif-network
init-volume:
	@docker volume create video-to-gif-vol

init-docker-env: init-network init-volume
# ******* INIT NECESSAIRY SWARM ENV END *******

# ******* UNDO SWARM ENV INITIALIZATION BEGIN *******
remove-volume:
	@docker volume rm video-to-gif-vol
remove-network:
	@docker network rm video-to-gif-network
leave-swarm:
	@docker swarm leave

drop-docker-env: remove-volume remove-network
# ******* UNDO SWARM ENV INITIALIZATION END *******

# ******* DEPLOY APP BEGIN *******
build-frontend:
	@docker build -f ./dockerfiles/frontend.Dockerfile -t video-to-gif-frontend .
build-backend:
	@docker build -f ./dockerfiles/backend.Dockerfile -t video-to-gif-backend .
deploy-images:
	@API_PORT=$(API_PORT) && docker stack deploy -c ./docker-compose.yaml video-to-gif

deploy: build-frontend build-backend deploy-images
# ******* DEPLOY APP END *******

# ******* STOP DEPLOY BEGIN *******
remove-stack:
	@docker stack rm video-to-gif
# ******* STOP DEPLOY END *******

# ******* PERFORMANCE TEST BEGIN *******
test:
	@bash ./test/script.sh
# ******* PERFORMANCE TEST END *******
	
	