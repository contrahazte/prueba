"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateLogin_middlewares_1 = require("../middlewares/validateLogin.middlewares");
const auth_controllers_1 = require("../controllers/auth.controllers");
const router = (0, express_1.Router)();
// Ruta para login
router.post('/login', validateLogin_middlewares_1.validateLogin, auth_controllers_1.loginUser);
// Ruta para logout
router.post('/logout', auth_controllers_1.logoutUser);
exports.default = router;
