# CMDB Dashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.x.

## Kickstart

Clone the code to your local environment, then run `make` to build for production usage.

This is highly recommended if you are building it in docker or other stateless builders.

## Contributing

### Setup environment

Install Dev Tool Kit:

```bash
make devel
```

Sync dependencies:

```bash
make deps
```

### Run test server

```bash
make run
```

A nano web server will serve and listen on [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

### Build

```bash
make build
```

A optimized set of page artifacts using Ahead of Time compilation will be generated to `dist/`.