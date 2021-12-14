<h1 align="center">
  <a href="#"><img src="http://mysqlhighavailability.com/wp-content/uploads/2015/12/Node_Cluster_logo.png" alt="Inva UI" width="200"></a>
  <br>
  Clustering in NodeJs · Auth · Mysql
  <br>
  <br>
</h1>

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

---

### Guides

#### Run the project

1. Install dependencies

```
npm i
```

2. Make sure you have the up to date env file

3. Run the project in dev mode

```
npm run dev
```

- If you were to run the project with a custom cpu number (default 1 cpu)

```
CPUNUM=numberofcpu npm run dev
```

- Example (1 cpu)

```
CPUNUM=1 npm run dev
```

#### Create New Model/Migration

We will use model:generate command. This command requires two options:

- name: the name of the model;
- attributes: the list of model attributes.
  Let's create a model named <b>User</b>.

```
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

This will:

- Create a model file user in models folder;
- Create a migration file with name like XXXXXXXXXXXXXX-create-user.js in migrations folder.

#### Running the migtrations (syncing it with the database)

```
npm run db:sync
```

#### Undoing migrations

```
npm run db:sync:undo
```

#### Creating Seeders

```
npx sequelize-cli seed:generate --name demo-user
```

##### Populating the seeders

This command will create a seed file in seeders folder. File name will look something like XXXXXXXXXXXXXX-demo-user.js. It follows the same up / down semantics as the migration files.

Now we should edit this file to insert demo user to User table.

```js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'example@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
```

#### Running the seeds

```
npm run db:seed
```

#### Undoing the seeders

```
npm run db:seed:undo
```

---

## Clustering Implemented

<p>Lets look at some exmaples 🔥</p>
<img src="https://res.cloudinary.com/shaun-storage/image/upload/v1630434449/clustering-boilerplate.jpg"/>

_Note: To run the preceding commands, [Node.js](http://nodejs.org) and [npm](https://npmjs.com) must be installed._

### Boilerplate includes

- [x] `Clustering` in Node.js
- [x] Testing API speed with `loadtest`
- [x] Server with `Express.js`
- [x] Database schema and models using `Sequelize ORM`.
- [x] User authentication with `JWT`.
- [x] `StandardJs` for coding standards and styling.
- [x] Request validation using `Express-validator`.
- [x] `Morgan and Winston` for server side logging.
- [x] `Swagger` for API documentation.

## License

[MIT](LICENSE). Copyright (c) [Shaun Mak](https://shaunmak.com).
