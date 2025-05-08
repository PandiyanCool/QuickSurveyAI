const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

app.http("GetSurvey", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const surveyId = request.query.get("id");

      if (!surveyId) {
        return {
          status: 400,
          body: "Survey ID is required",
        };
      }

      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);
      const container = database.container("surveys");

      const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @surveyId",
        parameters: [
          {
            name: "@surveyId",
            value: surveyId,
          },
        ],
      };

      const { resources: surveys } = await container.items
        .query(querySpec)
        .fetchAll();

      if (!surveys || surveys.length === 0) {
        return {
          status: 404,
          body: "Survey not found",
        };
      }

      // Transform the survey data to match the expected format
      const rawSurvey = surveys[0];
      const transformedSurvey = {
        id: rawSurvey.id,
        topic: rawSurvey.topic || rawSurvey.title,
        description:
          rawSurvey.description ||
          `Please provide your feedback on ${
            rawSurvey.topic || rawSurvey.title
          }`,
        questions: rawSurvey.questions.map((q) => ({
          id: q.questionId,
          text: q.question.text,
          type: q.type || q.question.type,
          required: q.question.required,
          options: q.question.options || [],
        })),
        createdAt: rawSurvey.createdAt,
        responses: rawSurvey.responses || 0,
      };

      return {
        status: 200,
        jsonBody: transformedSurvey,
      };
    } catch (error) {
      context.error(`Error getting survey: ${error.message}`);
      return {
        status: 500,
        body: `Error getting survey: ${error.message}`,
      };
    }
  },
});
