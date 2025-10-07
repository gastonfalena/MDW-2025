"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middlewares/middleware"));
const create_user_dto_1 = require("../dto/create-user.dto");
const router = express_1.default.Router();
router.post("/register", (0, middleware_1.default)(create_user_dto_1.CreateUserDto), userController_1.registerUser);
router.post("/login", userController_1.login);
router.post("/logout", userController_1.logout);
exports.default = router;
