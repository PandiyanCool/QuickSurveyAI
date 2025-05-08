const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

// Initialize Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY,
});

const database = cosmosClient.database(process.env.COSMOS_DB_NAME);
const container = database.container("surveys");

app.http("GetSurveyResults", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      // Get survey ID from query parameter
      const surveyId = request.query.get("surveyId");

      if (!surveyId) {
        return {
          status: 400,
          body: "Survey ID is required",
        };
      }

      // Query Cosmos DB for the survey results
      const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @surveyId",
        parameters: [
          {
            name: "@surveyId",
            value: surveyId,
          },
        ],
      };

      const { resources: results } = await container.items
        .query(querySpec)
        .fetchAll();

      if (!results || results.length === 0) {
        return {
          status: 404,
          body: "Survey not found",
        };
      }

      return {
        status: 200,
        jsonBody: results[0],
      };
    } catch (error) {
      context.error(`Error retrieving survey results: ${error.message}`);
      return {
        status: 500,
        body: `Error retrieving survey results: ${error.message}`,
      };
    }
  },
});
