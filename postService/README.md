# GitHub Copilot Agent Mode POC: Adding Swagger Documentation to NestJS Microservice

## Project Overview

This project demonstrates the use of GitHub Copilot's Agent Mode to add Swagger/OpenAPI documentation to a NestJS microservice. We implemented comprehensive API documentation for the `postService` microservice within a larger microservices architecture.

## The Goal

The goal was to add proper Swagger documentation to our NestJS v8 microservice (`postService`), including:

1. Installing compatible Swagger packages
2. Adding API decorators to controllers
3. Enhancing DTOs with Swagger property decorators
4. Creating response DTOs for proper API documentation
5. Configuring Swagger UI with authentication support

## The Process with GitHub Copilot Agent Mode

### Setup Phase

We started by asking GitHub Copilot Agent to help us add Swagger documentation to our NestJS postService. The agent first analyzed our codebase to:

1. Determine the NestJS version (v8) to ensure compatible package installation
2. Understand the structure of our controllers, DTOs, and services
3. Identify potential places for Swagger documentation enhancement

### Example Prompts

Here are some of the prompts we used throughout our iterations with GitHub Copilot Agent:

1. **Initial Setup Request**:

   ```
   Hello agent, I am planning to add swagger REST API documentation for this microservice.
   I want you to find proper npm packages that are compatible with installed nestJS dependecies and install.

   Add required changes in request and response DTOs of APIs and expose swagger documention for those.

   First start with current selected post.controller service.
   ```

2. **Version Compatibility Refinement**:

   ```
   npm install @nestjs/swagger swagger-ui-express

   This command you suggested can install latest version which would not be compatible with 2 year old nestJS.
   Please mention compatible exact version.
   ```

3. **Authentication Configuration**:

   ```
   Most of the endpoints require auth with JWT. please add a section to do the same for each API tag or section.
   ```

4. **Expanding to All Controllers**:

   ```
   Add required changes in request and response DTOs of APIs and expose swagger documention for those.
   Add API documentation on all missing controllers of postService.
   ```

5. **Troubleshooting ESLint Issues**:
   ```
   Help me fix the issue:
   Parsing error: Cannot read file '/home/dhruvpatel/node-training/micro-cosmos/backend/tsconfig.json'.eslint
   There is tsconfig file in postService module.
   ```

### Implementation Phase

Through multiple iterations with Copilot Agent, we:

1. **Installed compatible packages**:

   ```bash
   npm install @nestjs/swagger@5.2.1 swagger-ui-express@4.6.1
   ```

2. **Created response DTOs** for proper API documentation:

   - `PostResponseDto`
   - `LikeResponseDto`
   - `CommentResponseDto`

3. **Enhanced existing DTOs** with `@ApiProperty` decorators to properly document:

   - Required/optional fields
   - Field descriptions
   - Examples
   - Data types

4. **Added controller decorators**:

   - `@ApiTags` for grouping endpoints
   - `@ApiBearerAuth` for JWT authentication
   - `@ApiOperation` for endpoint descriptions
   - `@ApiResponse` for documenting response types and status codes
   - `@ApiExtraModels` for nested schemas
   - Special handling for file uploads via `@ApiConsumes('multipart/form-data')`

5. **Configured Swagger UI** in `main.ts` with proper security definitions

![image](https://github.com/user-attachments/assets/87a9e041-1c99-4648-91f7-dde1eb619679)
 
![image](https://github.com/user-attachments/assets/a0ae1842-27c1-4973-b157-b9d95564fe16)


### Issues and Iterations

We encountered several issues during the implementation:

1. **TypeScript errors**:

   - Initially faced issues with incorrect usage of `required: false` in `@ApiProperty` decorators
   - Resolved by removing the property and relying on TypeScript optionals

2. **Schema definition issues**:

   - The `required: []` array at the schema level was causing errors
   - Fixed by removing the arrays and relying on property-level definitions

3. **ESLint configuration errors**:
   - ESLint was looking for a tsconfig.json file in the parent directory
   - Added proper `tsconfigRootDir` to all microservice .eslintrc.js files
   - Created a root-level .eslintrc.js to handle parent directory files

## Pros of GitHub Copilot Agent Mode

1. **Code Analysis**: Copilot Agent effectively analyzed our complex microservice architecture and understood relationships between files.

2. **Adaptive Learning**: The agent adapted to our feedback and improved its recommendations with each iteration.

3. **Context-Aware Solutions**: Provided solutions specific to our codebase rather than generic examples.

4. **Comprehensive Implementation**: Handled multiple files and aspects of the implementation simultaneously.

5. **Version Compatibility**: Understood the specific requirements of NestJS v8 and recommended compatible package versions.

6. **Problem Solving**: Effectively diagnosed and fixed ESLint configuration issues across multiple services.

## Cons of GitHub Copilot Agent Mode

1. **Multiple Iterations Required**: Several iterations were needed to get everything right, especially when dealing with validation errors.

2. **Occasional Misunderstanding**: Sometimes misunderstood certain aspects of NestJS decorators' requirements.

3. **Limited Testing Abilities**: Could suggest changes but couldn't directly test them in a running application.

4. **Schema Reference Limitations**: Had difficulty with certain aspects of OpenAPI schema references.

5. **Verbosity**: Sometimes provided overly verbose explanations when simple fixes would suffice.

6. **Recursive Problem Solving Loops**: Sometimes got caught in loops trying to identify and fix issues on its own, focusing on one particular problem repeatedly without advancing to other aspects of the implementation.

## Conclusion

GitHub Copilot Agent Mode proved to be a powerful tool for implementing Swagger documentation in our NestJS microservice. While it required some guidance and multiple iterations, it significantly accelerated the development process by:

1. Generating boilerplate documentation code
2. Providing compatible package versions
3. Ensuring consistency across multiple files
4. Helping troubleshoot and fix configuration issues

For complex tasks like adding comprehensive API documentation to an existing microservice, Copilot Agent Mode offers significant productivity benefits despite requiring some oversight and iteration.

## Running the Service

Once all changes are implemented, you can access the Swagger UI at:

```
http://localhost:7003/api
```

This provides an interactive documentation interface for all endpoints in the postService microservice, with proper authentication support.
