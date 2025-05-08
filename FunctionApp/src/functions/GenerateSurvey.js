const { app } = require("@azure/functions");
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

app.http("GenerateSurvey", {
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

      const { topic, numQuestions = 5 } = body;

      if (!topic) {
        return {
          status: 400,
          body: "Topic is required",
        };
      }

      if (numQuestions < 1 || numQuestions > 20) {
        return {
          status: 400,
          body: "Number of questions must be between 1 and 20",
        };
      }

      const client = new OpenAIClient(
        process.env.AZURE_OPENAI_ENDPOINT,
        new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
      );

      const prompt = `Generate ${numQuestions} survey questions about ${topic}. Format the response as a JSON array of strings.`;

      const response = await client.getChatCompletions(
        process.env.AZURE_OPENAI_MODEL,
        [
          {
            role: "user",
            content: prompt,
          },
        ]
      );

      if (!response.choices?.[0]?.message?.content) {
        throw new Error("No response from OpenAI");
      }

      let questions;
      try {
        questions = JSON.parse(response.choices[0].message.content);
        if (!Array.isArray(questions)) {
          throw new Error("Response is not an array");
        }
      } catch (e) {
        context.error(`Failed to parse OpenAI response: ${e.message}`);
        return {
          status: 500,
          body: "Failed to generate valid survey questions",
        };
      }

      return {
        status: 200,
        jsonBody: {
          topic,
          questions,
        },
      };
    } catch (error) {
      context.error(`Error generating survey: ${error.message}`);
      return {
        status: 500,
        body: `Error generating survey: ${error.message}`,
      };
    }
  },
});
