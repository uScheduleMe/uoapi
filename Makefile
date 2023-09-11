.PHONY: t test
t: test
test :
	pytest

.PHONY: c check
c: check
check :
	mypy

.PHONY: l lint
l: lint
lint :
	flake8
