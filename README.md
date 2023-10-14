# API News!

###### A News API...

## Project Summary

'API News' is an attempt at coding and deploying a Node API. Its purpose is to allow users to manipulate data for a fictitious news website. This includes Articles, Topics, Users of the website and their Comments.

The database is hosted on Elephant SQL. It has been developed using Test-Driven Development to ensure the error-handling works correctly.

If you wish to find out a list of endpoints implemented for this project, providing valid queries and example responses, navigate to `/api`

## Hosted Version

You can access the hosted version of this API here: https://api-news-zhvd.onrender.com/

## Instructions

**1. Setting Up**

If you wish to clone this project, open your terminal and navigate to the directory you would like to keep this project in. Once you're there, enter the following command:

```
git clone (then paste the repo url here)
```

To run this project locally, you will need to create two .env files to connect each database to a local variable environment:

- `.env.test`
- `.env.development`

Within each, add PGDATABASE=, and the correct database name for that environment.

- `.env.test`: PGDATABASE=nc_news_test
- `.env.development`: PGDATABASE=nc_news

Double check that these .env files are .gitignored !

**2. Initialising the Project as a Node Project**

Simply type the following command in your terminal to initialise the project as a Node project

```
npm init -y
```

**3. Installing the required packages**

You can perform the following two commands in your terminal to install all the packages you will need for your development dependencies and dependencies respectively.

For development dependencies:

```
npm install husky jest jest-extended jest-sorted pg-format --save-dev
```

For dependencies:

```
npm install dotenv ex express fs.promises pg supertest --save
```

**4. Seeding Local Database**

Navigate to your scripts in the `package.json`. Run the `seed` script to correctly seed the database.

You can verify that the seeding has worked by running the following commands in this order:

1.  `psql` - Enter the psql shell
2.  `\l` - List all databases on your local system
3.  `\c nc_news` - Connect to the nc_news database
4.  `\dt` - List all tables in that database (make sure you have run the seed script, otherwise you won't see any tables!)
5.  `\q` - Quit the psql shell

**5. Testing**

You can now test your application and all of the endpoints. You can do this by running:

```
npm test app
```

This command also seeds the test database before each test. And now you're ready to use and test a Node API project. Happy Coding!
