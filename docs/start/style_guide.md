# WasmEdge Style Guide

- [Documentation Style Guide](#documentation-style-guide)
  - [Language](#language)
  - [Structure and Format](#structure-and-format)
  - [Content](#content)
  - [Other Considerations](#other-considerations)
- [Coding Style Guide](#coding-style-guide)
  - [Code Formatting](#code-formatting)
  - [Code Quality](#code-quality)
  - [Testing](#testing)
  - [Security](#security)

## Documentation Style Guide

### Language

- Use clear, simple, and concise language. Avoid jargon and technical terms as much as possible. If they are unavoidable, provide clear definitions or explanations.
- Write in the active voice and use the second person ("you") to make the documentation more user-oriented.

### Structure and Format

- Structure content with descriptive headings and subheadings.
- Make content more readable and easier to follow with bullet points and numbered lists.
- Include code examples and technical references where necessary. They should be well-formatted and easy to understand. Use code blocks and syntax highlighting for code examples.

### Content

- Start with an introduction that provides an overview of the topic.
- Provide step-by-step instructions and include code examples where necessary.
- Include a section on troubleshooting to help users solve common problems they might encounter.

### Other Considerations

- Encourage contributions from the community. Include a section explaining how users can contribute to the project.
- Regularly review the content and make updates as necessary.
- Ensure that the documentation is accessible to everyone. It should be easy to read, understand, and navigate.

## Coding Style Guide

### Code Formatting

- Use consistent indentation. For example, you can choose to use spaces over tabs and stick with it throughout the project.
- Use meaningful variable, function, and class names. They should clearly indicate what the variable contains, what the function does, etc.
- Comment your code. Explain what each section or line of code does, especially if it involves complex logic.

### Code Quality

- Keep your code DRY (Don't Repeat Yourself). If you find yourself writing the same code in multiple places, consider creating a function or class.
- Write small, single-purpose functions. Each function should do one thing and do it well.
- Handle errors properly. Don't leave empty catch blocks in your code.

### Testing

- Write tests for your code. This helps to catch bugs early and makes sure that the code is working as expected.
- Follow a testing methodology, like unit testing or integration testing.

### Security

- Avoid code that might lead to security vulnerabilities, such as SQL injection.
- Use secure functions and libraries.
- Follow the security best practices provided by the CNCF.
