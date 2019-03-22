# ezauth

ezauth is an express web api template for authenticating users using [JSON web tokens](https://www.jwt.io).

ezauth uses argon2 to securely hash user passwords for saving in a mongoose/mongoDB database.

Easily configure express route authorization. Authorization is set up to use the JWT bearer scheme.

To do:
Implement OWASP guidance for [JWT](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/JSON_Web_Token_Cheat_Sheet_for_Java.md) and [password storage](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Password_Storage_Cheat_Sheet.md).
