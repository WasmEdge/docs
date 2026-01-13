---
sidebar_position: 1
displayed_sidebar: contributeSidebar
---

# Contribute and Extend WasmEdge

Contribution is always welcome! The WebAssembly ecosystem is still in its early days. Hosted by CNCF, WasmEdge aims to become an open source “reference implementation” of WebAssembly and its edge-related extensions. WasmEdge is developed in the open, and is constantly being improved by our users, contributors, and maintainers. It is because of you that we can bring great software to the community.We are looking forward to working together with you!

To help new contributors understand WasmEdge development workflow, this guide will include

- [Build WasmEdge and WasmEdge plug-in from source on different platforms](/category/build-wasmedge-from-source)
- [WasmEdge Plug-in system introduction](/category/wasmedge-plugin-system)
- [Test WasmEdge](./test/testing.md)
- [WasmEdge Fuzzing](fuzzing.md)
- [WasmEdge internal explanation](internal.md)
- [WasmEdge installer system explanation](installer.md)
- [WasmEdge installer v2 system explanation](installer_v2.md)
- [contributing steps](contribute.md)
- [WasmEdge release process](release.md)
- [Join WasmEdge community](community.md)

## Contribution Flow

To contribute to WasmEdge

### Signing-off on Commits (Developer Certificate of Origin)

To contribute to this project, you must agree to the Developer Certificate of Origin (DCO) for each commit you make. The DCO is a simple statement that you, as a contributor, have the legal right to make the contribution.

See the [DCO](https://developercertificate.org) file for the full text of what you must agree to and how it works [here](https://github.com/probot/dco#how-it-works). To signify that you agree to the DCO for contributions, you simply add a line to each of your git commit messages:

```text
Signed-off-by: John Doe <john.doe@example.com>
```

In most cases, you can add this signoff to your commit automatically with the `-s` or `--signoff` flag to `git commit`. You must use your real name and a reachable email address (sorry, no pseudonyms or anonymous contributions). An example of signing off on a commit:

```bash
git commit -s -m “my commit message w/signoff”
```

To ensure all your commits are signed, you may choose to add this alias to your global `.gitconfig`:

```text
[alias]
  amend = commit -s --amend
  cm = commit -s -m
  commit = commit -s
```

Or you may configure your IDE, for example, Visual Studio Code to automatically sign-off commits for you:

![VSCode sign-off](https://user-images.githubusercontent.com/7570704/64490167-98906400-d25a-11e9-8b8a-5f465b854d49.png)

## Ideas for contributions

If you're looking for something to contribute, we have issues

- labeled with [`good first issue`](https://github.com/WasmEdge/WasmEdge/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22), which are recommendations for developers to contribute to WasmEdge by working on some easy tasks. These tasks will help contributors to learn the WasmEdge development workflow.

- labeled with [`help wanted`](https://github.com/WasmEdge/WasmEdge/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22), for which are we need suggestions and opinions from the community.

- [Roadmap](https://github.com/WasmEdge/WasmEdge/blob/master/docs/ROADMAP.md) for every year, which elaborates the new features in the coming days. You are also welcome to pick one.

If you find something is missing, don't hesitate to create an issue and let us know. Again, WasmEdge is open in development.

## Mentoring

WasmEdge maintainers can provide mentoring for WasmEdge, WebAssembly, C++, Rust, compiler, etc. If you are interested in fixing one open issue, just let us know by commenting under the issue. WasmEdge maintainers will reply to your question in time.

Besides the regular GitHub issues, the WasmEdge project will participate in some open source mentoring projects like [Google Summer of Code (GSoC)](https://summerofcode.withgoogle.com/), [Google Season of Docs (GSoD)](https://developers.google.com/season-of-docs), [LFX Mentorship](https://mentorship.lfx.linuxfoundation.org/#projects_all), and [Open Source Promotion Plan (OSPP)](https://summer-ospp.ac.cn/). Join our [Discord server](https://discord.gg/U4B5sFTkFc) or follow [@realwasmedge](https://twitter.com/realwasmedge) on Twitter to get alerts on the application details.
