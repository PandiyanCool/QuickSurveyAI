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

      const { topic, description, questions } = body;

      // Validate required fields
      if (!topic) {
        return {
          status: 400,
          body: "Topic is required",
        };
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return {
          status: 400,
          body: "At least one question is required",
        };
      }

      // Transform questions to ensure consistent structure
      const transformedQuestions = questions.map((q) => ({
        questionId: q.id,
        question: {
          id: q.id,
          text: q.text,
          type: q.type,
          required: q.required || false,
          options: q.options || [],
        },
        type: q.type,
      }));

      const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
      const database = client.database(process.env.COSMOS_DB_NAME);
      const container = database.container("surveys");

      const surveyItem = {
        id: Date.now().toString(),
        topic,
        description: description || "",
        questions: transformedQuestions,
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
