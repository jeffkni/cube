import {
  Network,
  StartedNetwork,
  StartedTestContainer,
  GenericContainer,
  Wait,
} from "testcontainers";
//import { DriverTests } from "@cubejs-backend/testing-shared";
import GraphQLDriver from "../src";

import { CubeGraphQLConverter } from "@cubejs-client/playground/src/components/GraphQL/CubeGraphQLConverter";

describe("GraphQLDriver", () => {
  let container: StartedTestContainer;
  let container2: StartedTestContainer;
  let network: StartedNetwork;

  jest.setTimeout(2 * 60 * 1000);

  beforeAll(async () => {
    network = await new Network().start();
    container = await new GenericContainer("postgres:13.4")
      .withName("test-postgres")
      .withNetwork(network)
      .withEnvironment({
        POSTGRES_USER: "postgres",
        POSTGRES_DB: "testing",
        POSTGRES_PASSWORD: "postgres",
      })
      .withHealthCheck({
        test: ["CMD", "pg_isready", "-U postgres -d testing"],
        interval: 2 * 1000,
        timeout: 500,
        retries: 3,
      })
      .withWaitStrategy(Wait.forHealthCheck())
      .withBindMounts([
        {
          source: `${__dirname}/init.sql`,
          target: "/docker-entrypoint-initdb.d/init.sql",
        },
      ])
      .withStartupTimeout(120000)
      .start();

    const connection =
      "postgres://postgres:postgres@test-postgres:5432/testing";
    container2 = await new GenericContainer("graphile/postgraphile:4")
      .withName("test-postgraphile")
      .withNetwork(network)
      .withNetworkAliases("test")
      .withExposedPorts({ container: 5000, host: 5000 })
      .withCommand(["--connection", connection])
      .start();

    console.log("container 2 days", container2.exec(["hostname", "uptime"]));

    //tests = new DriverTests(new GraphQLDriver(), j^i{
    //  expectStringFields: true,
    //});
  });

  test("First Test", async () => {
    const driver = new GraphQLDriver();
    const query = `{
             result: allVisitors {
               nodes {
                 id
                 amount
                 status
               }
             }`;
    console.log("running query ...");
    const result = await driver.query(query, []);
    console.log("got json: ", JSON.stringify(result));
    expect(result).toEqual([
      { id: 1, amount: 100, status: 1 },
      { id: 2, amount: 200, status: 1 },
      { id: 3, amount: 300, status: 2 },
      { id: 4, amount: 400, status: 2 },
      { id: 5, amount: 500, status: 2 },
      { id: 6, amount: 500, status: 2 },
    ]);
  });

  /* 
  Conversion possibly via
  ../../cubejs-playground/src/components/GraphQL/CubeGraphQLConverter';
  */

  test("Convert query", async () => {
    //  const converter = new CubeGraphQLConverter(, types);
  });
  afterAll(async () => {
    if (container) await container.stop();
    if (container2) await container2.stop();
    if (network) await network.stop();
    console.log("great");
  });
});
