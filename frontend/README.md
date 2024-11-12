# Frontend Application

This is the frontend application for the meme generator project. It is built using React, TypeScript, and various other
libraries.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [Contexts](#contexts)
- [Types](#types)
- [Usage](#usage)

## Installation

To install the dependencies, run:

```bash
npm install
```

After the installation, check installation logs for any errors or warnings. Then make sure that `node_modules` directory
has been created.

After this all the dependencies have been installed successfully. Next step is to set up the environment variables.

## Environment Variables

The following environment variables are required:

- **NEXT_PUBLIC_BACKEND_URL**: The base URL for the backend server.
- **NEXT_PUBLIC_API_BASE_URL**: The base URL for the API endpoints.
- **NEXT_PUBLIC_API_IMAGES_URL**: The base URL for the images inside public directory.

These variables should be defined in a `.env` file in the root of the project and should not have trailing `'/'`
included.

Example:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_IMAGES_URL=http://localhost:5000/images
```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the app in production mode.

## Components

The components are divided into two main categories: UI components and page components. The UI components are
reusable **Shad-cn UI** components and can be found in the `src/components/ui/ directory`. The page components are the
located in `src/components` directory.

## Contexts

The contexts are used to manage the global state of the application. They are located in the `src/contexts/` directory.
Main context is `AuthContext` which manages user state.

## Types

The types are used to define the types of the application. They are located in the `src/types/` directory. The types are

## Usage

To use the frontend application, run the one of the following commands:

```bash
npm run start
```

This will start the development server and open the application in your default web browser.

```bash
npm run dev
```

This will start the development server and open the application in your default web browser while listening for changes
in the code to perform **Hot-Reloading**.

```bash
npm run build
```

This will build the application for production.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
