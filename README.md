@@
# WasmEdge

WasmEdge is a lightweight, high-performance, and extensible WebAssembly runtime for cloud native, edge, and decentralized applications. It powers serverless apps, embedded functions, microservices, udf, smart contracts, and IoT devices. WasmEdge is currently a CNCF (Cloud Native Computing Foundation) Sandbox project.

# WasmEdge Docs

This repository contains the technical documentation for the [WasmEdge Runtime](https://github.com/WasmEdge/WasmEdge) project. The documentation website built from this repo is published [here](https://wasmedge.org/docs/). It contains all the necessary information on what Wasm Edge Runtime is and how to develop Wasm app, embed WasmEdge into your host applications, and extend/contribute to WasmEdge.

Check it out!
https://wasmedge.org/docs/

# Setting up the Docs Locally

To set up the WasmEdge Docs locally, you will need to follow these general steps:

1. Clone the project : Go to the GitHub repository page of the WasmEdge Docs project and click on the "Code" button to get the URL of the repository. Then, open a terminal or command prompt and type the following command:
```
git clone https://github.com/WasmEdge/docs.git
```

1. Install dependencies : Navigate to the project directory in the terminal and run the following command to install the necessary dependencies:
```
npm install
```
1. Start the development server : Once the dependencies are installed, you can start the development server by running the following command:
```
npm start
```

This should start the development server on port 3000. You can access the running application by opening a web browser and navigating to http://localhost:3000/docs/.

That's it! You should now have a local instance of the WasmEdge Docs running on your machine.


# Contributing to the Docs

If you want to contribute to the WasmEdge Docs, you can follow these steps:

1. Fork the project : Click the "Fork" button on the top-right corner of the repository page to create a copy of the project in your GitHub account.

1. Clone the forked project : Open a terminal or command prompt and type the following command:
```
git clone <forked-repository-url>
```
1. Create a new branch : Navigate to the project directory and create a new branch to make your changes in:
```
git checkout -b my-new-branch
```
1. Make your changes : Make any changes or additions to the documentation in the project directory.
1.Commit your changes : Once you are satisfied with your changes, commit them with a descriptive commit message
```
git add .
```
```
git commit -m " Message  Signed-off-by: Name <email@example.com> "
                             OR
                 git commit -s -m " Message "
```
1.Push your changes : Push your changes to your forked repository:
```
git push origin my-new-branch
```
1.Create a pull request : Go to the original repository page and click the "New pull request" button. Select your forked repository and the branch you created. Add a description of your changes and click "Create pull request".

That's it! Your changes will now be reviewed by the maintainers of the WasmEdge Docs project.


**NOTE -  _DCO Sign-Off Required_** :
To contribute to this project, each commit must be signed off with the developer's name and email address. This sign-off indicates that the contributor has the right to submit the code under the project's license and agrees to the project's Developer Certificate of Origin (DCO).

To sign off on a commit, you can add the following line to your commit message and replace "Your Name" and "your-email@example.com" with your actual name and email address. Alternatively, you can use the -s flag to sign off on a commit automatically.






## Features

### [Develop](https://wasmedge.org/docs/develop/overview)

It provides information on:
1. How to get started with WasmEdge
2. How to develop Wasm apps in various languages (C/C++, Go, Rust, JavaScript)
3. How to deploy WasmEdge apps in Kubernetes 

### [Embed](https://wasmedge.org/docs/embed/overview)

It provides information on how to embed Wasm functions using various SDKs and some use cases.

### [Extend](https://wasmedge.org/docs/contribute/overview)

It provides insights on how to start contributing to the WasmEdge, Ideas for contribution and Mentoring.

###

## Configuring docs to local machine

To set up this repo to your local machine, follow the below steps:

1. Clone the repo : Go to the GitHub repository of the WasmEdge Docs project and click on the "Code" button. Copy the https link of the repository. Typethe below command in the terminal or command prompt:
```
git clone https://github.com/WasmEdge/docs.git/
```

2. Installing the dependencies : Navigate to the project directory in the terminal and run the following command to install the necessary dependencies:
```
npm install
```

3. Start the development server : To start the development server, run the following command:
```
npm start
```

You can access the running application by opening a web browser and navigating to http://localhost:3000/docs/.


## Contributing to the Docs

You've discovered a bug or something else you want to change — excellent!

You've worked out a way to fix it — even better!

You want to tell us about it — best of all!

Start at the [contributing
guide](https://wasmedge.org/book/en/contribute.html) document for details.

<br>
To contribute to the WasmEdge Docs, you can follow these steps:

1. Fork the project : Click the "Fork" button on the top-right corner of the repository page to create a copy of the project in your GitHub account.

2. Clone the forked project : Type the following command in terminal/command prompt:
```
git clone <forked-repository-url>
```
3. Create a new branch : Navigate to the project directory and create a new branch to make your changes in:
```
git checkout -b my-new-branch
```
-b will create a new branch named : (my-new-branch) and checkout in it.

4. Make your changes : Make any changes or additions to the documentation in the project directory on your local machine.

5. Commit your changes : Once you make the changes, commit them with a descriptive signed-off commit message
```
git add .
```
```
git commit -m " Message  Signed-off-by: Name <email@example.com> "
                             OR
                 git commit -s -m " Message "
```
6. Push your changes : Push your changes to your forked repository:
```
git push origin my-new-branch
```
7. Create a pull request : Go to the original repository page and click the "New pull request" button. Select your forked repository and the branch you created. Add a description of your changes and click "Create pull request".

Your changes will now be reviewed by the maintainers of the WasmEdge Docs project and will be merged if the commit is considered apt.


**NOTE -  _DOC Sign-Off Required_** :
To contribute to this project, each commit must be signed off with the developer's name and email address. This sign-off indicates that the contributor has the right to submit the code under the project's license and agrees to the project's Developer Certificate of Origin (DCO).

To sign off on a commit, you can add the following line to your commit message and replace "Your Name" and "your-email@example.com" with your actual name and email address. Alternatively, you can use the -s flag to sign off on a commit automatically.

## Contact

If you have any questions, feel free to open a GitHub issue on a related project or to join the following channels:

* Mailing list: Send an email to [WasmEdge@googlegroups.com](https://groups.google.com/g/wasmedge/)
* Discord: Join the [WasmEdge Discord server](https://discord.gg/h4KDyB8XTt)!
* Slack: Join the #WasmEdge channel on the [CNCF Slack](https://slack.cncf.io/)
* Twitter: Follow @realwasmedge on [Twitter](https://twitter.com/realwasmedge)


## Community Meeting

We host a monthly community meeting to showcase new features, demo new use cases, and a Q&A part. Everyone is welcome!

Time: The first Tuesday of each month at 11PM Hong Kong Time/ 7AM PST.

Public meeting agenda/notes | Zoom link

## To start contributing, check out some open issues:
[Open Issuse](https://github.com/WasmEdge/docs/issues)
<br>
For some bug with no open issue:
1. Open an issue on the github repo of the WasmEdgedocs 
2. Create pull requests for those changes.