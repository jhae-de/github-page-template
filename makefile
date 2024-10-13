include .env
export

PROJECT_NAME ?= JHAE GitHub Page Template
COMPOSE_PROJECT_NAME ?= $(shell echo $(PROJECT_NAME) | sed 's/\(.*\)/\L\1/;s/[^[:alnum:]_-]/-/g')

.DEFAULT_GOAL = help
TARGET_DESCRIPTION_INDENTATION = 15

.PHONY: help
help: ## Display this help
	@printf "\n\033[1;30m$(shell echo $(PROJECT_NAME))\033[0m\n\n\033[33mUsage:\033[0m\n  make [target]\n\n\033[33mTargets:\033[0m\n"
	@awk 'BEGIN {FS = ":.*?## "} \
		/^[^#[:space:]]+:.*?## / { \
			if (section) { \
				printf "\n  \033[33m%*s\033[0m\n", 2, section; \
				section = ""; \
			} \
			printf "  \033[34m%-$(TARGET_DESCRIPTION_INDENTATION)s\033[0m %s\n", $$1, $$2; \
		} \
		/^#[[:space:]]*[A-Z ]+[[:space:]]TARGETS/ { \
			sub(/^#[[:space:]]*/, ""); \
			section = $$0; \
		}' $(firstword $(MAKEFILE_LIST))

# APP TARGETS
.PHONY: app-bash
app-bash: start ## Access the jekyll container
	@docker compose exec jekyll bash

.PHONY: app-build
app-build: start ## Perform a one off build of the site
	@docker compose exec jekyll bash -c 'bundle exec jekyll build'

.PHONY: app-clean
app-clean: start ## Remove all generated files: destination folder, metadata file, Sass and Jekyll caches
	@docker compose exec jekyll bash -c 'bundle exec jekyll clean'

.PHONY: app-fix
app-fix: start ## Automatically fix, where possible, problems in the source code
	@docker compose exec jekyll bash -c 'npm run-script fix'

.PHONY: app-install
app-install: docker-pull start ## Install the dependencies
	@docker compose exec jekyll bash -c 'npm install && bundle install'

.PHONY: app-lint
app-lint: start ## Detect problems in the source code
	@docker compose exec jekyll bash -c 'npm run-script lint'

.PHONY: app-serve
app-serve: start ## Build the site and serve it locally at http://localhost:4000
	@docker compose exec jekyll bash -c 'bundle exec jekyll serve --host 0.0.0.0 --livereload'

# DOCKER TARGETS
.PHONY: docker-destroy
docker-destroy: ## Remove the docker containers, images without a custom tag, volumes and orphans
	@docker compose down --rmi local --volumes --remove-orphans

.PHONY: docker-logs
docker-logs: ## Follow the output of the docker container logs
	@docker compose logs --follow

.PHONY: docker-pull
docker-pull: ## Pull the docker service images
	@docker compose pull

.PHONY: docker-status
docker-status: ## List the status of the docker containers
	@docker compose ps --all

# START AND STOP TARGETS
.PHONY: start
start: ## Start the docker containers
	@docker compose up --detach --remove-orphans --wait

.PHONY: stop
stop: ## Stop the docker containers
	@docker compose down --remove-orphans
