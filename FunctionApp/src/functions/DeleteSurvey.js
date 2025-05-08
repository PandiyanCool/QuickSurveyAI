const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

app.http("DeleteSurvey", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { id } = await request.json();

      if (!id) {
        return {
          status: 400,
          body: "Survey ID is required",
        };
      }

      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);

      // Delete survey
      const surveysContainer = database.container("surveys");
      await surveysContainer.item(id, id).delete();

      // Delete all responses for this survey
      const responsesContainer = database.container("responses");
      const querySpec = {
        query: "SELECT * FROM c WHERE c.surveyId = @surveyId",
        parameters: [
          {
            name: "@surveyId",
            value: id,
          },
        ],
      };

      const { resources: responses } = await responsesContainer.items
        .query(querySpec)
        .fetchAll();

      // Delete each response
      await Promise.all(
        responses.map((response) =>
          responsesContainer.item(response.id, response.id).delete()
        )
      );

      return {
        status: 200,
        jsonBody: {
          message: "Survey and its responses deleted successfully",
        },
      };
    } catch (error) {
      context.error(`Error deleting survey: ${error.message}`);
      return {
        status: 500,
        body: `Error deleting survey: ${error.message}`,
      };
    }
  },
});
