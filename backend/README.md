# meme generator backend

Here are instructiuons for installing and running the backend. The setup should
work, assuming you run the scripts in your terminal while in meme-stable/backend
folder.

## installing dependencies

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

### Mongodb

To spin up mongodg, use docker with:
```
docker-compose up -d
```

This will use `./docker-compose.yml` file to create a docker container for mongodb

### Node and dependencies

Verify you have **Node v20.18.0** with:
```
node --version
```

#### Install node packages
```
npm install
```

#### Run the backend
```
npm run start
```