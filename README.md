<div align="center">
  <h1>Mockooo</h1>
</div>

Mockooo is a personal fork of [Mockoon](https://mockoon.com), the open-source API mocking tool. It's used and built locally, not distributed or published under the Mockoon name/branding.

All credit for the original design, features, and codebase goes to the [Mockoon project](https://github.com/mockoon/mockoon) and its maintainers. This fork is released under the same [MIT license](./LICENSE.md).

## What it does

- Design and run mock API servers locally, with no remote deployment or account required
- CLI to run mocks in headless environments and CI
- Full control over route definitions: HTTP methods/statuses, regex paths, file serving, custom headers, etc.
- OpenAPI compatibility
- Request logging, JSON templating, proxy forwarding, HTTPS support

## Monorepo layout

This project uses NPM workspaces, with packages under `./packages/`:

- `app`: the desktop/web application
- `cli`: the command-line interface
- `commons` / `commons-server`: shared libraries
- `cloud`: cloud sync types/utils
- `serverless`: run mocks in serverless environments (AWS Lambda, GCP Functions, etc.)

## Building and running locally

See [CONTRIBUTING.md](./CONTRIBUTING.md#build-and-run-the-applications-locally-during-development) for setup and build instructions.

## License

MIT — see [LICENSE.md](./LICENSE.md). Copyright of the original Mockoon codebase belongs to its original author; changes in this fork are not separately licensed.
