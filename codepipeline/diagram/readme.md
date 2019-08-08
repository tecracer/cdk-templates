# Automatic diagrams for blog post

G.Glawe July 2019

## Overview

AWS simple icons "_light-bg@4x" are used.

## Usage

`task render` - run render.

See [task homepage](https://taskfile.dev/#/) for information about `task`.

## Installation

### Install graphviz as docker images

The current brew package for *graphviz* on mac does not handle images properly. So the `dot` command is run from a Docker images.

```bash
docker run --rm -it -v $PWD:/code -w /code dot:latest dot -Tpng lambda-simple.dot -o lambda-simple.png
```

1. `--rm`cleanup
2. `-it` interactive
3. `v $PWD:/code` mount local directory in `/code` in container
4. `dot:latest` use this image
5. `dot -Tpng lambda-simple.dot -o lambda-simple.png` the dot command

#### Build Docker image

```bash
docker build --tag=dot .
```
