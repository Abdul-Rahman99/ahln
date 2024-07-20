"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const dotenv_1 = __importDefault(require("dotenv"));
const i18n_1 = __importDefault(require("./config/i18n"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = require("../config");
const error_middleware_1 = require("./middlewares/error.middleware");
const mqtt_1 = require("./config/mqtt");
const models_1 = __importDefault(require("./models"));
const localization_middleware_1 = __importDefault(require("./middlewares/localization.middleware"));
const path_1 = __importDefault(require("path"));
const responsesHandler_1 = __importDefault(require("./utils/responsesHandler"));
const app_1 = require("firebase-admin/app");
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
(0, models_1.default)();
mqtt_1.client;
app.use(localization_middleware_1.default);
app.use(i18n_1.default.init);
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, express_mongo_sanitize_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);
app.use('/uploads', express_1.default.static(path_1.default.join(config_1.config.UPLOADS)));
(0, routes_1.default)(app);
config_1.config.FCM_TOKEN;
(0, app_1.initializeApp)({
    credential: (0, app_1.applicationDefault)(),
    projectId: 'ahlnowner-eaf04',
});
app.use((_req, res) => {
    responsesHandler_1.default.badRequest(res, i18n_1.default.__('YOU_ARE_LOST'));
});
app.use(error_middleware_1.errorMiddleware);
const PORT = config_1.config.PORT;
const server = app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('Shutting down server...');
        process.exit(1);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map