"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: 'postgresql://postgres:mysecretpassword@127.0.0.1:5432/nest_study',
    },
});
//# sourceMappingURL=prisma.config.js.map