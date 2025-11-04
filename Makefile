.DEFAULT_GOAL := init

%:
	@:

init:
	echo "Specify an Action"

up:
	docker compose up -d --build

down:
	docker compose  down

dev-js:
	pnpm run start

build-production-js:
	pnpm run preuglify && pnpm run uglify

wp-format:
	pnpm run format

i18n-pot:
	composer run makepot

zip:
	pnpm run plugin-zip

inspection:
	./vendor/bin/phpcs -p . --standard=PHPCompatibilityWP

build:
	pnpm run build

release: build

clean:
	rm -rf build && rm -rf vendor && rm -rf node_modules
