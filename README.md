# WasmEdge Docs

This repo contains technical documentation for the [WasmEdge Runtime](https://github.com/WasmEdge/WasmEdge) project. The documentation website built from this repo is published [here](https://wasmedge.org/docs/), check it out!

https://wasmedge.org/docs/

# Setting up the Docs Locally

To set up the WasmEdge Docs locally, you will need to follow these general steps:

**1. Clone the project:** Go to the GitHub repository page of the WasmEdge Docs project and click on the "Code" button to get the URL of the repository. Then, open a terminal or command prompt and type the following command:
```
git clone https://github.com/WasmEdge/docs.git
```

**2. Install dependencies:** Navigate to the project directory in the terminal and run the following command to install the necessary dependencies:
```
npm install
```

**3. Start the development server:** Once the dependencies are installed, you can start the development server by running the following command:
```
npm start
```

This should start the development server on port 3000. You can access the running application by opening a web browser and navigating to http://localhost:3000/docs/.

That's it! You should now have a local instance of the WasmEdge Docs running on your machine.


# Contributing to the Docs

If you want to contribute to the WasmEdge Docs, you can follow these steps:

**1. Fork the project:** Click the "Fork" button on the top-right corner of the repository page to create a copy of the project in your GitHub account.

**2. Clone the forked project:** Open a terminal or command prompt and type the following command:
```
git clone <forked-repository-url>
```

**3. Create a new branch:** Navigate to the project directory and create a new branch to make your changes in:
```
git checkout -b my-new-branch
```

**4. Make your changes:** Make any changes or additions to the documentation in the project directory.

**5. Add your changes:** Once you are satisfied with your changes, add them to git using the command below:    
```
git add .
``` 

**6. Commit your changes:** Once you are satisfied with your changes, commit them with a descriptive commit message and sign them off. 

```
git commit -m " Message  Signed-off-by: Name <email@example.com> "
                             OR
                 git commit -s -m " Message "
```
**7. Push your changes:** Push your changes to your forked repository:
```
git push origin my-new-branch
```

**8. Create a pull request:** Go to the original repository page and click the "New pull request" button. Select your forked repository and the branch you created. Add a description of your changes and click "Create pull request".

That's it! Your changes will now be reviewed by the maintainers of the WasmEdge Docs project.


**NOTE -  _DCO Sign-Off Required_** :
To contribute to this project, each commit must be signed off with the developer's name and email address. This sign-off indicates that the contributor has the right to submit the code under the project's license and agrees to the project's Developer Certificate of Origin (DCO).

To sign off on a commit, you can add the following line to your commit message and replace "Your Name" and "your-email@example.com" with your actual name and email address. Alternatively, you can use the -s flag to sign off on a commit automatically.





