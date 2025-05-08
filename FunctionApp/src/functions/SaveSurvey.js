const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");

app.http("SaveSurvey", {
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

      const { title, topic, description, questions } = body;

      // Validate required fields - check both title and topic
      if (!title && !topic) {
        return {
          status: 400,
          body: "Either title or topic is required",
        };
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return {
          status: 400,
          body: "At least one question is required",
        };
      }

      // Validate each question has required fields
      for (const question of questions) {
        if (!question.text || !question.type) {
          return {
            status: 400,
            body: "Each question must have text and type",
          };
        }
      }

      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);
      const container = database.container("surveys");

      const surveyItem = {
        id: Date.now().toString(),
        title: title || topic, // Use title if available, otherwise use topic
        description: description || "",
        questions,
        createdAt: new Date().toISOString(),
        responses: 0,
      };

      try {
        await container.items.create(surveyItem);
      } catch (e) {
        context.error(`Failed to save survey to Cosmos DB: ${e.message}`);
        return {
          status: 500,
          body: "Failed to save survey to database",
        };
      }

      return {
        status: 200,
        jsonBody: {
          message: "Survey saved successfully",
          id: surveyItem.id,
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
