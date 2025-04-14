---
sidebar_position: 3
---

# Best Practises for WasmEdge Application Testing

Writing WasmEdge applications involves a blend of best practices from WebAssembly development, cloud computing, and edge computing. These best practices can serve as a guide to building robust, scalable, and efficient WasmEdge applications.

## Design Principles

1. **Modular Code:** Keep your WebAssembly modules small and focused, making them easier to test.

2. **Mock External Dependencies:** Use mocking to isolate your tests from external services or modules.

3. **Documentation:** Document your tests to explain what each test does and why specific assertions are made.

4. **Balance Cost and Performance:** While it's important to cover as many test cases as possible, also consider the time and computational resources needed to run extensive tests.

5. **Version Control:** Keep both your code and tests in version control, ensuring that they evolve together.

6. **Continuous Integration:** Integrate testing into your CI/CD pipeline to catch issues early.

## Tools and Frameworks

- **Google Test:** For C/C++ unit testing.

- **WasmEdge API:** For testing WebAssembly modules directly.

- **Selenium/Puppeteer:** For web-based end-to-end testing.

- **Jenkins/GitHub Actions:** For continuous integration and automated testing.

## Optional Packages and Third-Party Integrations

- **Code Coverage:** Tools like lcov for C/C++.
- **Static Analysis:** Tools like cppcheck for C/C++.