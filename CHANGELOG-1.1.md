# CHANGELOG for 1.1

- Move all signup, login, delete_account functionality to UserController, `src/controllers/user_controller.js`
- Move all authentication functionality to AuthHandler, `src/handlers/auth_handler.js`
- Change environment variable names. 
- Remove template files for private and public routes.
- Add functionality to automatically require all route files in `src/routes/api/`
- Add functionality for `config` to automatically require all dependencies listed in `package.json`. Names are the same except `-` is replaced with `_`.
- Remove `JSONResponse` class.
- Add `ClientError`, `SystemError` classes.
- Rename `src/app.js` to `src/main.js`