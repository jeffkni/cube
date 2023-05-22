// const { getEnv, assertDataSource } = require("@cubejs-backend/shared");
// const SqlString = require("sqlstring");
import { BaseDriver } from "@cubejs-backend/base-driver";
import axios from "axios";

export class GraphQLDriver extends BaseDriver {
  public constructor() {
    super({
      testConnectionTimeout: 5000,
    });
    console.log("===> GraphQLDriver ctor <===");
  }

  public async testConnection(): Promise<void> {
    console.log("test connection");
    return Promise.resolve();
  }

  //abstract query<R = unknown>(_query: string, _values?: unknown[], _options?: QueryOptions): Promise<R[]>;
  public async query(query: string, values: []) {
    const result = await axios.post(
      "http://localhost:5000/graphql",
      {
        query,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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
