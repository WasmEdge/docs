---
sidebar_position: 8
---

# Contributing Steps

## Setup Development Environment

The WasmEdge is developed on Ubuntu 20.04 to take advantage of advanced LLVM features for the AOT compiler. The WasmEdge team also builds and releases statically linked WasmEdge binaries for older Linux distributions.

Our development environment requires `libLLVM-12` and `>=GLIBCXX_3.4.26`.

If you use an operating system older than Ubuntu 20.04, please use our [special docker image] to build WasmEdge. If you are looking for the pre-built binaries for the older operating system, we also provide several pre-built binaries based on the `manylinux2014` distribution.

To build WasmEdge from the source, please refer to: [Build WasmEdge from source](/category/build-wasmedge-from-source).

## Contribution Workflow

Pull requests are always welcome, even if they only contain minor fixes like typos or a few lines of code. If there will be a significant effort, please document it as an issue and get a discussion going before starting to work on it.

Please submit a pull request broken down into small changes bit by bit. A pull request consisting of many features and code changes may take a lot of work to review. It is recommended to submit pull requests incrementally.

<!-- prettier-ignore -->
:::note
If you split your pull request into small changes, please ensure any changes that go to the main branch will not break anything. Otherwise, it can only be merged once this feature is complete.
:::

### Fork and Clone the Repository

Fork [the WasmEdge repository](https://github.com/WasmEdge/WasmEdge) and clone the code to your local workspace

### Branches and Commits

Changes should be made on your own fork in a new branch. Pull requests should be rebased on the top of the main branch.

The WasmEdge project adopts [DCO](https://www.secondstate.io/articles/dco/) to manage all contributions. Please ensure you add your `sign-off-statement` through the `-s` or `--signoff` flag or the GitHub Web UI before committing the pull request message.

### Develop, Build, and Test

Write code on the new branch in your fork, and [build from source code](/category/build-wasmedge-from-source) with the option `-DWASMEDGE_BUILD_TESTS=ON`.

Then you can use these tests to verify the correctness of WasmEdge binaries.

```bash
cd <path/to/wasmedge/build_folder>
LD_LIBRARY_PATH=$(pwd)/lib/api ctest
```

### Push and Create A Pull Request

When ready for review, push your branch to your fork repository on github.

Then visit your fork at <https://github.com/$user/WasmEdge> and click the `Compare & Pull Request` button next to your branch to create a new pull request. The pull request description should refer to all the issues it addresses. Remember to reference issues (using keywords such as Closes #XXX and Fixes #XXX) in the comment so that the issues can be closed when the PR is merged. After creating a pull request, please check that the CI passes with your code changes.

Once your pull request has been opened, it will be assigned to one or more reviewers. Those reviewers will do a thorough code review, looking for correctness, bugs, opportunities for improvement, documentation and comments, and coding style.

Commit changes made in response to review comments to the same branch on your fork.

## Reporting issues

It is a great way to contribute to WasmEdge by reporting an issue. Well-written and complete bug reports are always welcome! Please open an issue on GitHub.

Before opening any issue, please look up the existing [issues](https://github.com/WasmEdge/WasmEdge/issues) to avoid submitting a duplication. If you find a match, you can "subscribe" to it to get notified of updates. If you have additional helpful information about the issue, please leave a comment.

When reporting issues, always include:

- Version of your system
- Configuration files of WasmEdge

Because the issues are open to the public, when submitting the log and configuration files, be sure to remove any sensitive information, e.g. user name, password, IP address, and company name. You can replace those parts with "REDACTED" or other strings like "\*\*\*\*". Be sure to include the steps to reproduce the problem if applicable. It can help us understand and fix your issue faster.

## Documenting

Update the documentation if you are creating or changing features. Good documentation is as necessary as the code itself. Documents are written with Markdown. Our docs reside at this [repository](https://github.com/WasmEdge/docs/)

See [Writing on GitHub](https://help.github.com/categories/writing-on-github/) for more details.

## Feature Requests

- **Suggesting Enhancements**: If you have ideas for improving existing features in WasmEdge, we welcome your input.
- **Introducing New Features**: You're also encouraged to propose completely new functionalities that could benefit the project.
- **How to Submit**: To formalize your suggestions, please submit a feature request proposal through [GitHub Issues](https://github.com/WasmEdge/docs/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml&title=Feature+Request%3A+).

### Review Process

- **Timely Evaluation**: Our team of WasmEdge maintainers will review your proposal as quickly as possible.
- **Architectural Consistency**: We aim to ensure that all contributions align well with the existing architecture of WasmEdge.
- **Avoiding Redundancy**: Part of the review process includes checking the project's roadmap to avoid duplicated efforts.

### Communication

- **Feedback Loop**: After the initial review, we may ask for further clarifications or suggest modifications to align with the project's goals.
- **Status Updates**: We aim to keep you informed about the status of your proposal throughout the review process.

