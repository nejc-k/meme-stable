# Backend Application

This is the backend application for the meme generator project. It is built using Node.js, Express, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routes](#routes)
- [Usage](#usage)
- [License](#license)

## Installation

### Node.js

Verify you have **Node v20.18.0** with:
```
node --version
```

To install the dependencies, run:

```bash
npm install
```

After the installation, check installation logs for any errors or warnings. Then make sure that `node_modules` directory
has been created.

### python

For this project to run correctly, python **3.10.15** needs to be used.

Install it on your system, we recommend you use `miniconda`, `pyenv`, ...
or similar tool to manage different python versions on your system.

To verify you have correct version of python run:

```
python --version
```
<sub>or equivalent for your python version manager</sub>

It should output `Python 3.10.15`

#### create venv

With the correct version of python, run:
```
python -m venv ./env
```

and activate it with:
```
source ./env/bin/activate
```
on Windows use:
```
./env/Scripts/activate.bat
```

#### Install python dependencies
```
pip install -r req.txt
```

#### Custom stable diffusion model

Put all files from [google drive folder](https://drive.google.com/drive/folders/113-5yBivNFYdn-lx2h640-UWgWRSd-D6?usp=sharing) into `./backend/meme_model`, so the python script can read the model and generate images.

### MongoDB

In case you are not running a local instance of MongoDB, you can use provided `docker-compose.yml` file to build and run Docker container with MongoDB inside. IN such case run the command:

```
docker-compose up -d
```

After this all the dependencies have been installed successfully. Next step is to set up the environment variables.

## Environment Variables

The following environment variables are required:

- **MONGODB_URI**: The URI for connecting to the MongoDB database.
- **EXPRESS_SESSION_SECRET**: The secret for Express sessions.
- **FRONTEND_URI**: The URI for the frontend application.
- **API_BASE_URI**: The base URI for the API.
- **PORT**: The port on which the server will run.

These variables should be defined in a `.env` file in the root of the project.

Example:

```env
MONGODB_URI=mongodb://localhost:27017/meme-generator
EXPRESS_SESSION_SECRET=secret
FRONTEND_URI=http://localhost:3000
API_BASE_URI=http://localhost:5000/api
PORT=5000
```

## Available Scripts

In the project directory, you can run:

- `npm run start`: Runs the app in the development mode.
- `npm run devStart`: Runs the app in the development mode with nodemon.

## Routes

Backend service uses the following routes:

- `/api/auth`: User authentication.
- `/api/users`: User model manipulation.
- `/api/generator`: Meme generation.
- `/api/images`: Image management.

\* Keep in mind that `/api/images` is image management tool, while images can be accessible through `/images` route from
the public directory of the backend service _(for now)_.

## Usage

To start the server, run one of the following commands:

```bash
npm run start
```
