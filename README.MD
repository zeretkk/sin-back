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
setx JWT_ACCESS_SECRET <secret>
setx JWT_REFRESH_SECRET <secret>

#linux systems
export DB_USER=username
export DB_PASS=password
export JWT_ACCESS_SECRET <secret>
export JWT_REFRESH_SECRET <secret>
```
Or create an .env file in project root directory that contains:
```shell
DB_USER=username
DB_PASS=password
JWT_ACCESS_SECRET=secret
JWT_REFRESH_SECRET=secret
```

## Usage
To run app listener:
```shell
# Will restart the application when files are updated
npm run dev

#build typescript
npm run build  

#Standard application launch option
npm start
```

