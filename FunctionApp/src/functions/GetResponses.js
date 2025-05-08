const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

app.http("GetResponses", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const surveyId = request.query.get("surveyId");

      if (!surveyId) {
        return {
          status: 400,
          body: "Survey ID is required",
        };
      }

      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);
      const container = database.container("responses");

      const querySpec = {
        query:
          "SELECT * FROM c WHERE c.surveyId = @surveyId ORDER BY c.createdAt DESC",
        parameters: [
          {
            name: "@surveyId",
            value: surveyId,
          },
        ],
      };

      const { resources: responses } = await container.items
        .query(querySpec)
        .fetchAll();

      return {
        status: 200,
        jsonBody: responses || [],
      };
    } catch (error) {
      context.error(`Error getting responses: ${error.message}`);
      return {
        status: 500,
        body: `Error getting responses: ${error.message}`,
      };
    }
  },
});
