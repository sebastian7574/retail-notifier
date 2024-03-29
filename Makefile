stop: stop-scrapper stop-others

stop-others:
	@docker-compose stop rabbitmq elasticsearch

stop-scrapper:
	@docker-compose stop scrapper

start: start-others start-scrapper

start-scrapper:
	@docker-compose build && docker-compose up -d scrapper

start-others:
	@docker-compose up -d rabbitmq elasticsearch

monitor:
	@docker-compose exec scrapper pm2 monit