# banzai-web-frontend

## Development
See [DEVELOPMENT.md](DEVELOPMENT_K8s.md) for instructions on setting up a local development environment.

It is simplest to start up a local copy of the [BANZAI-web backend](https://github.com/lcogt/banzai-web).
If you do not want to start the backend, edit config.json in k8s/envs/local/ to `https://banzai-web-api.staging.lco.earth/`

Enter development shell:

```shell
./develop.sh
```

Start a local development container registry and Kubernetes cluster:

```shell
devenv-k8s-cluster-up
```

Start development loop:

```shell
skaffold -p app dev
```

You can access the frontend at <https://banzai-web.local.lco.earth>

## Development with yarn on bare metal

```shell
yarn install
```

### Compiles and hot-reloads for development

```shell
yarn serve
```

### Compiles and minifies for production

```shell
yarn build
```

### Lints and fixes files

```shell
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
