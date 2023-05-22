import { BaseDriver } from "@cubejs-backend/base-driver";
export declare class GraphQLDriver extends BaseDriver {
    constructor();
    testConnection(): Promise<void>;
    query(query: string, values: []): Promise<any>;
}
//# sourceMappingURL=GraphQLDriver.d.ts.map