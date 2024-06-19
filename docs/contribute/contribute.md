---
sidebar_position: 8
---

# Contributing Guide


* [New Contributor Guide](#contributing-guide)
  * [Ways to Contribute](#ways-to-contribute)
  * [Find an Issue](#find-an-issue)
  * [Ask for Help](#ask-for-help)
  * [Pull Request Lifecycle](#pull-request-lifecycle)
  * [Development Environment Setup](#development-environment-setup)
  * [Sign Your Commits](#sign-your-commits)
  * [Pull Request Checklist](#pull-request-checklist)

Welcome! We are glad that you want to contribute to our project! 💖

As you get started, you are in the best position to give us feedback on areas of
the project that we need help with including:

* Problems found during setting up a new developer environment
* Gaps in our Quickstart Guide or documentation
* Bugs in our automation scripts

If anything doesn't make sense, or doesn't work when you run it, please open a
bug report and let us know!

## Ways to Contribute

We welcome many different types of contributions including:

* New features
* Report a bug
* Builds, CI/CD
* Bug fixes
* Documentation
* Issue Triage
* Answering questions on Slack/Mailing List/GitHub issues
* Web design
* Communications / Social Media / Blog Posts
* Release management

Not everything happens through a GitHub pull request. Please come to our
[meetings](https://docs.google.com/document/d/1iFlVl7R97Lze4RDykzElJGDjjWYDlkI8Rhf8g4dQ5Rk/edit?usp=sharing) or [contact us](WasmEdge@gmailgroup.com) and let's discuss how we can work
together. 

### Come to Meetings


Absolutely everyone is welcome to come to any of our meetings. You never need an
invite to join us. In fact, we want you to join us, even if you don’t have
anything you feel like you want to contribute. Just being there is enough!

You can find out more about our meetings [here](https://docs.google.com/document/d/1iFlVl7R97Lze4RDykzElJGDjjWYDlkI8Rhf8g4dQ5Rk/edit?usp=sharing). You don’t have to turn on
your video. The first time you come, introducing yourself is more than enough.
Over time, we hope that you feel comfortable voicing your opinions, giving
feedback on others’ ideas, and even sharing your own ideas, and experiences.

## Find an Issue

We have good first issues for new contributors and help wanted issues suitable
for any contributor. [good first issue](https://github.com/WasmEdge/WasmEdge/labels/good%20first%20issue) has extra information to
help you make your first contribution. [help wanted](Thttps://github.com/WasmEdge/WasmEdge/labels/help%20wanted) are issues
suitable for someone who isn't a core maintainer and is good to move onto after
your first pull request.

Sometimes there won’t be any issues with these labels. That’s ok! There is
likely still something for you to work on. If you want to contribute but you
don’t know where to start or can't find a suitable issue, you can leave a commnet under this issue like "I'd like to work on this. Can you tell XYZ (list the stuff you want to communicate)" or send your questions to our discord server or slack channel.

Once you see an issue that you'd like to work on, please post a comment saying
that you want to work on it. Something like "I want to work on this" is fine.

## Ask for Help

The best way to reach us with a question when contributing is to ask on:

* The original github issue
* Mailing list: Send an email to [WasmEdge@googlegroups.com](mailto:WasmEdge@googlegroups.com)
* Discord: Join the [WasmEdge Discord server](https://discord.gg/h4KDyB8XTt)!
* Slack: Join the #WasmEdge channel on the [CNCF Slack](https://slack.cncf.io/)

Before opening any issue, please look up the existing [issues](https://github.com/WasmEdge/WasmEdge/issues) to avoid submitting a duplication. If you find a match, you can "subscribe" to it to get notified of updates. If you have additional helpful information about the issue, please leave a comment.

When reporting issues, always include:

- Version of your system
- Configuration files of WasmEdge

Because the issues are open to the public, when submitting the log and configuration files, be sure to remove any sensitive information, e.g. user name, password, IP address, and company name. You can replace those parts with "REDACTED" or other strings like "\*\*\*\*". Be sure to include the steps to reproduce the problem if applicable. It can help us understand and fix your issue faster.


## Pull Request Lifecycle

Pull requests are always welcome, even if they only contain minor fixes like typos or a few lines of code. If there will be a significant effort, please document it as an issue and get a discussion going before starting to work on it.

Please submit a pull request broken down into small changes bit by bit. A pull request consisting of many features and code changes may take a lot of work to review. It is recommended to submit pull requests incrementally.

Generally, once your pull request has been opened, it will be assigned to one or more reviewers. Those reviewers will do a thorough code review, looking for correctness, bugs, opportunities for improvement, documentation and comments, and coding style. If your PR is not ready to review, please mark you PR as draft.

The reviewers will give you some feedback in three workdays. 

After the first review is done, the PR comtributor is expected to review and make some changes based on the review in 5 workdays. 

If you have finished the adjustments, mark the problem as solved, then the reviewers will review your PR again in 2 workdays.

If the PR contributor doesn't respond to the PR in 30 days, the miantainer will close the PR. The original PR contributor is welcome to open it again. 

If the PR contributor don't want to maintain the PR due to some reason, please enable maintainers edit this PR if you still want this PR to be merged.

When your PR is merged, your contribution will be implemented in the next release. And we will add the contributors's GitHub name in the release note.

## Development Environment Setup

The WasmEdge is developed on Ubuntu 20.04 to take advantage of advanced LLVM features for the AOT compiler. The WasmEdge team also builds and releases statically linked WasmEdge binaries for older Linux distributions.

Our development environment requires `libLLVM-12` and `>=GLIBCXX_3.4.26`.

If you use an operating system older than Ubuntu 20.04, please use our [special docker image] to build WasmEdge. If you are looking for the pre-built binaries for the older operating system, we also provide several pre-built binaries based on the `manylinux2014` distribution.

To build WasmEdge from the source, please refer to: [Build WasmEdge from source](/category/build-wasmedge-from-source).

## Sign Your Commits

### DCO
Licensing is important to open source projects. It provides some assurances that
the software will continue to be available based under the terms that the
author(s) desired. We require that contributors sign off on commits submitted to
our project's repositories. The [Developer Certificate of Origin
(DCO)](https://probot.github.io/apps/dco/) is a way to certify that you wrote and
have the right to contribute the code you are submitting to the project.

You sign-off by adding the following to your commit messages. Your sign-off must
match the git user and email associated with the commit.

    This is my commit message

    Signed-off-by: Your Name <your.name@example.com>

Git has a `-s` command line option to do this automatically:

    git commit -s -m 'This is my commit message'

If you forgot to do this and have not yet pushed your changes to the remote
repository, you can amend your commit with the sign-off by running 

    git commit --amend -s 


## Pull Request Checklist

When you submit your pull request, or you push new commits to it, our automated
systems will run some checks on your new code. We require that your pull request
passes these checks, but we also have more criteria than just that before we can
accept and merge it. We recommend that you check the following things locally
before you submit your code:

* DCO: Did you sign off your commit
* Code of conduct: Did you follow the CNCF code of condct


## Reporting issues


## Documenting

Update the documentation if you are creating or changing features. Good documentation is as necessary as the code itself. Documents are written with Markdown. See [Writing on GitHub](https://help.github.com/categories/writing-on-github/) for more details.

## Design new features

You can propose new designs for existing WasmEdge features. You can also design new features; please submit a proposal via the GitHub issues.

WasmEdge maintainers will review this proposal as soon as possible to ensure the overall architecture is consistent and to avoid duplicated work in the roadmap.

New features of WasmEdge will be discussed via a GitHub issue or the community meeting.
