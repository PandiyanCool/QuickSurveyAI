const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

// Initialize Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY,
});

const database = cosmosClient.database(process.env.COSMOS_DB_NAME);
const container = database.container("surveys");

app.http("SaveSurvey", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      // Parse request body
      const body = await request.json();

      // Validate required fields
      const { topic, questions } = body;

      if (!topic || !questions || !Array.isArray(questions)) {
        return {
          status: 400,
          body: "Missing required fields: topic and questions array are required",
        };
      }

      // Create survey document
      const surveyDoc = {
        id: `survey_${Date.now()}`,
        topic,
        questions: questions.map((question, index) => ({
          questionId: `q${index + 1}`,
          question,
          type: "rating", // default type, can be customized
        })),
        createdAt: new Date().toISOString(),
        type: "survey",
      };

      // Save to Cosmos DB
      const { resource: savedSurvey } = await container.items.create(surveyDoc);

      return {
        status: 201,
        jsonBody: {
          message: "Survey saved successfully",
          surveyId: savedSurvey.id,
          survey: savedSurvey,
        },
      };
    } catch (error) {
      context.error(`Error saving survey: ${error.message}`);
      return {
        status: 500,
        body: `Error saving survey: ${error.message}`,
      };
    }
  },
});
