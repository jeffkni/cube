"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDriver = void 0;
// const { getEnv, assertDataSource } = require("@cubejs-backend/shared");
// const SqlString = require("sqlstring");
const base_driver_1 = require("@cubejs-backend/base-driver");
const axios_1 = __importDefault(require("axios"));
class GraphQLDriver extends base_driver_1.BaseDriver {
    constructor() {
        super({
            testConnectionTimeout: 5000,
        });
        console.log("===> GraphQLDriver ctor <===");
    }
    async testConnection() {
        console.log("test connection");
        return Promise.resolve();
    }
    //abstract query<R = unknown>(_query: string, _values?: unknown[], _options?: QueryOptions): Promise<R[]>;
    async query(query, values) {
        const result = await axios_1.default.post("http://localhost:5000/graphql", {
            query,
        }, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(`query ${query} / values: ${values}`);
        return result.data?.data?.result.nodes;
        /*
        Set of options (pros / cons)
        - connect with graphl driver (TBD)
        - "Middleware" cache - call graphQL store in DB
        - No CubeJS - Code up end of day reports ourselves, however
        - connect directly to dbs
        - ~"lake house"
        */
        return [];
    }
}
exports.GraphQLDriver = GraphQLDriver;
//# sourceMappingURL=GraphQLDriver.js.map