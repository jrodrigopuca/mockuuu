<div align="center">
  <h1>Mockuuu</h1>
</div>

Mockuuu is a personal fork of [Mockoon](https://mockoon.com), the open-source API mocking tool — rebuilt under its own name, icon, and build pipeline. Prebuilt installers are published on the [Releases page](https://github.com/jrodrigopuca/mockuuu/releases); none of it is distributed under the Mockoon name or branding.

All credit for the original design, features, and codebase goes to the [Mockoon project](https://github.com/mockoon/mockoon) and its maintainers. This fork is released under the same [MIT license](./LICENSE.md).

## What it does

- Design and run mock API servers locally, with no remote deployment or account required
- CLI to run mocks in headless environments and CI
- Full control over route definitions: HTTP methods/statuses, regex paths, file serving, custom headers, etc.
- OpenAPI compatibility
- Request logging, JSON templating, proxy forwarding, HTTPS support

## Documentation

In-app links (docs, tutorials, CLI reference) point to
[mockoon.com](https://mockoon.com/docs/latest/about/). That's intentional,
not an oversight: this fork didn't change the mocking engine, route
configuration, or CLI behavior, so Mockoon's own documentation is accurate
for Mockuuu too. Writing a parallel copy would just be the same content
maintained twice — this only changes if the underlying behavior ever
diverges from upstream.

## Monorepo layout

This project uses NPM workspaces, with packages under `./packages/`:

- `app`: the desktop application
- `cli`: the command-line interface
- `commons` / `commons-server`: shared libraries
- `cloud`: cloud sync types/utils
- `serverless`: run mocks in serverless environments (AWS Lambda, GCP Functions, etc.)

## Installing a release build

Builds are **not code-signed** (this fork doesn't hold an Apple Developer ID or
a Windows code-signing certificate — the original Mockoon team's would work,
but this isn't their app). Your OS will warn you on first launch:

- **macOS**: right-click (or Control-click) the app → **Open**. If it still
  refuses, run `xattr -cr /Applications/Mockuuu.app` in Terminal.
- **Windows**: click **More info** → **Run anyway** on the SmartScreen prompt.
- **Linux**: no warning, installs normally.

## Building and running locally

See [CONTRIBUTING.md](./CONTRIBUTING.md#build-and-run-the-applications-locally-during-development) for setup and build instructions.

## License

MIT — see [LICENSE.md](./LICENSE.md). Copyright of the original Mockoon codebase belongs to its original author; changes in this fork are not separately licensed.
