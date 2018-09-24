# ezauth

ezauth is an express web api for authenticating users using [JSON web tokens](https://www.jwt.io).

ezauth uses bcrypt to store passwords as secure hashes in a mongoDB database. The api uses mongoose ODM to validate and save user objects.