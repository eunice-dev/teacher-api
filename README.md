
### Installation

Download the project and install the Node.js packages

``` bash
$ npm install
```

### Database

MAMP is used for this project with the following config. Click [here](https://www.mamp.info/en/downloads/) to install MAMP.

``` bash
const config = {
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'teachers',
};
```

The database configuration is located at /data/config.js.
You may use /data/teachers.sql to import the database.

### Usage

Start the server using

``` bash
$ npm start
```

Run tests using

``` bash
$ npm test
```

Jest is used to run the tests.
