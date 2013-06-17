REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 5000 \
		--require should

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--require should \
		--growl \
		--watch

.PHONY: test test-w
