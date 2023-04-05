import { app } from "@azure/functions";
import { run } from "../../lib/Browser";
app.http("amazonScraper", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    const prompt: any = await request.json();
    const jsonData = await run(prompt.prompt);
    if (!jsonData) return { status: 500, body: "Error" };
    const data = JSON.stringify(jsonData);
    return { body: data };
  },
});
