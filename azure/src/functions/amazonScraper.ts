import { app } from "@azure/functions";
import { run } from "../../lib/Browser";
app.http("amazonScraper", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const prompt: any = await request.json();
    const jsonData = await run(prompt.prompt);
    context.log(`Http function processed request for url "${request.url}"`);
    if (!jsonData) return { status: 500, body: "Error" };
    const data = JSON.stringify(jsonData);
    return {
      status: 200,
      body: data,
    };
  },
});
