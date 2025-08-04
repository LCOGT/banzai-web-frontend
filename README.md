# banzai-web-frontend

## Development with Skaffold

Enter development shell:

```shell
nix develop --impure
```

Start a local development container registry and Kubernetes cluster:

```shell
ctlptl apply -f local-registry.yaml -f local-cluster.yaml
```

Deploy dependencies:

```shell
skaffold -p deps run
```

Start development loop:

```shell
skaffold -p app dev --port-forward
```

## Development with yarn on bare metal

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
