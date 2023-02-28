# Backend for an intern project

Node.js JSON API based on Express.js

## Installation
Using the npm install dependencies
```shell
npm install
#or
npm i
```
Set environment variables
```shell
#windows systems
setx DB_PASS <password>
setx DB_USER <username>

#linux systems
export DB_USER=username
export DB_PASS=password
```
Or create an .env file in project root directory that contains:
```shell
DB_USER=username
DB_PASS=password
```

## Usage
To run app listener:
```shell
# Will restart the application when files are updated
npm run dev

#Standard application launch option
npm start
```

