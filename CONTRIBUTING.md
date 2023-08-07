# Contributing Overview for WasmEdge Docs

You are always welcome to contribute and Thank you for your help in improving WasmEdge :)

This project values community collaboration and welcomes contributions from all interested parties. If you are new to the project, please review the newcomers welcome guide to learn more about how and where to contribute. Additionally, all contributors are expected to follow the Code of Conduct.

If you are ready to contribute, please search for open issues labeled "help-wanted" and choose one to work on. Feel free to join our Slack channel to participate in discussions or create a new issue if you have a suggestion or request. When submitting a pull request, please reference the corresponding open issue if one exists. To automatically close related issues in GitHub, include keywords in your pull request descriptions and commit messages.

- [Contribution Flow](#contribution-flow)
  - [Developer Certificate of Origin](#signing-off-on-commits-developer-certificate-of-origin)
- WasmEdge Contribution Flow
  - [WasmEdge Docs](#wasmedge-docs)
  - [WasmEdge Runtime](https://wasmedge.org/docs/contribute/)
  - [Reporting a vulnerability](https://github.com/WasmEdge/WasmEdge/blob/master/SECURITY.md)

## Contribution Flow

To contribute to WasmEdge Docs

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

### WasmEdge Docs

If you want to contribute to the WasmEdge Docs, you can follow these steps:

1. **Fork the project:** Click the "Fork" button on the top-right corner of the repository page to create a copy of the project in your GitHub account.

2. **Clone the forked project:** Open a terminal or command prompt and type the following command:

   ```bash
   git clone <forked-repository-url>
   ```

3. **Create a new branch:** Navigate to the project directory and create a new branch to make your changes in:

   ```bash
   git checkout -b my-new-branch
   ```

4. **Make your changes:** Make any changes or additions to the documentation in the project directory.

5. **Commit your changes:** Once you are satisfied with your changes, commit them with a descriptive commit message

   ```bash
   git add .
   ```

   ```bash
   git commit -m " Message  Signed-off-by: Name <email@example.com> "
                               OR
                   git commit -s -m " Message "
   ```

6. **Push your changes:** Push your changes to your forked repository:

   ```bash
   git push origin my-new-branch
   ```

7. **Create a pull request:** Go to the our repository page, <https://github.com/WasmEdge/docs> and click the "New pull request" button. Select your forked repository and the branch you created. Add a description of your changes and click "Create pull request".

That's it! Your changes will now be reviewed by the maintainers of the WasmEdge Docs project.
