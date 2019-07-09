develop:
	npx webpack-dev-server --hot --inline
build:
	rm -rf dist && NODE_ENV=production npx webpack
publish:
	npm publish --dry-run
setup:
	npm link
lint:
	npx eslint .
deploy:
	make build && surge ./dist --domain egortd-rss-reader.surge.sh