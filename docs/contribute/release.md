---
sidebar_position: 9
---

# Release Process

## Create the releasing process issue of the new version

- [ ] Keep adding new features, issues, and documents, and builds a checklist into the issue.
- [ ] Add the GitHub project of the new version.

## Write Changelog

- [ ] Make sure every change is written in the changelog.
- [ ] Make sure the `Changelog.md` has the correct version number and the release date.
- [ ] Copy the changelog of this version to `.CurrentChangelog.md`. (Our release CI will take this file as the release notes.)
- [ ] Record the contributor lists.
- [ ] Create a pull request, make sure the CI is all passed, and merge it.

## Create the Alpha Pre-Release

- [ ] In this step, the main features are completed. No more major features will be merged after the first Alpha pre-release.
- [ ] Make sure that the features in the releasing process issue are completed.
- [ ] Use git tag to create a new release tag `major.minor.patch-alpha.version`. And push this tag to GitHub.
- [ ] Wait for the CI builds and pushes the release binaries and release notes to the GitHub release page.
- [ ] Check the `Pre-release` checkbox and publish the pre-release.
- [ ] This step will automatically close and turn into the Beta or RC phase in about 3 days if there are no critical issues.

## Create the Beta Pre-Release

- [ ] This step is for the issue fixing if needed. No more features will be accepted.
- [ ] Make sure all the features in the releasing process issue are completed.
- [ ] Use git tag to create a new release tag `major.minor.patch-beta.version`. And push this tag to GitHub.
- [ ] Wait for the CI builds and pushes the release binaries and release notes to the GitHub release page.
- [ ] Check the `Pre-release` checkbox and publish the pre-release.
- [ ] This step will automatically close and turn into the RC phase in about 3 days if there are no critical issues.

## Create the RC Pre-Release

- [ ] In this step, the issue fixing is finished. The `RC` pre-releases are for installation, bindings, and package testing.
- [ ] Make sure that all the issues in the release process issue are completed.
- [ ] Update `WASMEDGE_CAPI_VERSION` in `CMakeLists.txt`.
- [ ] Update `wasmedge_version` in `docs/.env`.
- [ ] Use git tag to create a new release tag `major.minor.patch-rc.version`. And push this tag to GitHub.
- [ ] Wait for the CI builds and pushes the release binaries and release notes to the GitHub release page.
- [ ] Check the `Pre-release` checkbox and publish the pre-release.
- [ ] This step will automatically close and announce the official release in about three days if there are no critical issues.

## Create the Official Release

- [ ] Make sure the `Changelog.md`, `.CurrentChangelog.md` and the `SECURITY.md` have the correct version number and the release date.
- [ ] Use git tag to create a new release tag `major.minor.patch`. And push this tag to GitHub.
- [ ] Wait for the CI builds and push the release binaries and release notes to the GitHub release page.
- [ ] Publish the release.
- [ ] Close the releasing process issue and the GitHub project.

## Update the Extensions

Following projects will be updated with the `Alpha`, `Beta`, and `RC` pre-releases and the official release:

- [ ] [WasmEdge-Go SDK](https://github.com/second-state/WasmEdge-go)
- [ ] [WasmEdge-core NAPI package](https://github.com/second-state/wasmedge-core)
- [ ] [WasmEdge-extensions NAPI package](https://github.com/second-state/wasmedge-extensions)
