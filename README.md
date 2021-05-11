# graphql-jwt-example
Demonstrates Authentication &amp; Authorization in GraphQL using JWT

## Getting started with this project
- Clone this project.
- Create a `.env` file in the project root.
  * Add two variables `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`.
  * Assign random secret values (both values will be different) to these variables.
  * You might use `require('crypto').randomBytes(${length}).toString('hex')` to generate random values. I've used length = 256
- Create an `ormconfig.json` file in the project root.
```json-with-comments
{
    "name": "default", // name of the connection option
    "type": "YOURDBTYPE", // options: ["mysql", "mariadb", "postgres", "mssql", ...] (Relational Databases)
    "host": "localhost", // or any other host
    "port": PORTVALUE, // integer,  
    "username": "YOURUSERNAME", // your username
    "password": "YOURPASS", // your password
    "database": "YOURDBNAME", // your database name, ensure that this database already exists
    "logging": true,
    "synchronize": true,
    "entities": ["src/models/**/*.*"],
    "migrations": ["src/migrations/**/*.*"],
    "subscribers": ["src/subscribers/**/*.*"]
}
```
- Create a config object like this in `ormconfig.json`. I've used `"type": "postgres"` and `"port": 5432`.
- You need to have `redis-server` installed & running on your machine. I've used the default port `6379`. You can change the configuration in `redis.ts` file.
- If you're a **Windows** user, you can easily install & run `redis-server` on **WSL** (Windows Subsystem for Linux).
- Now, you can run `npm install` & then `npm start`.
- The GraphQL playground should be available at `http://localhost:4000`, if there were no errors.

### Feel free to create an issue if you face any problem.
