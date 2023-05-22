// import { UserError } from "../../../src/compiler/UserError";
// import { PostgresQuery } from "../../../src/adapter/PostgresQuery";
import { prepareCompiler } from "../../unit/PrepareCompiler";
import { GraphQLRunner } from "./GraphQLRunner";
// import { BaseDriver } from "@cubejs-backend/query-orchestrator";
import { BaseQuery } from "../../../src/adapter/BaseQuery";

describe("SQL Generation", () => {
  jest.setTimeout(200000);

  const dbRunner = new GraphQLRunner();
  const { compiler, joinGraph, cubeEvaluator } = prepareCompiler(`
    cube('cards', {
      sql: > 
           {
           allVisitors {
             nodes {
               id
               amount
               status
             }
           }
         }
      ,
      joins: {
        visitors: {
          relationship: 'belongsTo',
          sql: \`\${visitors}.id = \${cards}.visitor_id\`
        }
      },

      measures: {
        count: {
          type: 'count'
        }
      },

      dimensions: {
        id: {
          type: 'number',
          sql: 'id',
          primaryKey: true
        }
      }

    })
  `);

  test("something", async () => {
    console.log("compiler", compiler);
    console.log("join graph", joinGraph);
    console.log("cube eval", cubeEvaluator);
    console.log("ok to here");
    const query = new BaseQuery({ compiler, joinGraph, cubeEvaluator }, {});
    //const sql = query.buildSqlAndParams();
    //console.log("got sql", sql);
  });
  // end of tests
});
