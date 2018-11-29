# CMDB Dashboard

This project requires CMDB server.

## Kickstart

Clone the code to your local environment, then run `make` to build for production usage.

This is highly recommended if you are building it in docker or other stateless builders.

## Known Issues

1. The `MatSortable` component could not set `transition` properly if `MatTab`'s focus has changed.

## Contributing

This project is powered by Google Angular 6.0.x and Google Material Design.

### Setup Environment

Install Dev Tool Kit:

```bash
make devel
```

Sync dependencies:

```bash
make deps
```

### Run Test Server

```bash
make run
```

A nano web server will serve and listen on [http://127.0.0.1:4210/](http://127.0.0.1:4210/)

### Build

```bash
make build
```

A optimized set of page artifacts using Ahead of Time compilation will be generated to `dist/`.