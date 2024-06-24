"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const node_test_1 = require("node:test");
const request = (0, supertest_1.default)(index_1.default);
(0, node_test_1.describe)("Test basic endpoint server", () => {
    (0, node_test_1.it)("Get the / endpoint", async () => {
        const response = await request.get("/");
        console.log(response);
    });
});
//# sourceMappingURL=indexSpec.js.map