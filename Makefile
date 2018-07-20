all: devel build

deps:
	@yarn

test: deps
	@yarn run test

build: deps
	@yarn run build4prod

e2e: deps
	@yarn run e2e

lint: deps
	@yarn run lint

run: deps
	@yarn run start

devel:
	node -v
	@npm -g install @angular/cli
	@npm -g install yarn

.PHONY: \
	deps \
	test \
	build \
	e2e \
	lint \
	run \
	dist \