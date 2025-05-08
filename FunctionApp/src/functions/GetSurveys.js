const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

app.http("GetSurveys", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);
      const container = database.container("surveys");

      const querySpec = {
        query: "SELECT * FROM c ORDER BY c.createdAt DESC",
      };

      const { resources: surveys } = await container.items
        .query(querySpec)
        .fetchAll();

      return {
        status: 200,
        jsonBody: surveys,
      };
    } catch (error) {
      context.error(`Error getting surveys: ${error.message}`);
      return {
        status: 500,
        body: `Error getting surveys: ${error.message}`,
      };
    }
  },
});
