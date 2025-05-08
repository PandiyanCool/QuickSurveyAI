const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

app.http("SaveResponse", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return {
          status: 400,
          body: "Invalid JSON in request body",
        };
      }

      const { surveyId, responses } = body;

      if (!surveyId || !responses) {
        return {
          status: 400,
          body: "Survey ID and responses are required",
        };
      }

      if (!Array.isArray(responses)) {
        return {
          status: 400,
          body: "Responses must be an array",
        };
      }

      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);
      const container = database.container("responses");

      const responseItem = {
        id: `${surveyId}-${Date.now()}`,
        surveyId,
        responses,
        timestamp: new Date().toISOString(),
      };

      try {
        await container.items.create(responseItem);
      } catch (e) {
        context.error(`Failed to save response to Cosmos DB: ${e.message}`);
        return {
          status: 500,
          body: "Failed to save response to database",
        };
      }

      return {
        status: 200,
        jsonBody: {
          message: "Response saved successfully",
          responseId: responseItem.id,
        },
      };
    } catch (error) {
      context.error(`Error saving response: ${error.message}`);
      return {
        status: 500,
        body: `Error saving response: ${error.message}`,
      };
    }
  },
});
