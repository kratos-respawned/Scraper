import express from "express";
import Scrape from "./scraper.js";
import cors from "cors";
const app = express();
console.log("Hello World");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  const result = Scrape(req.body);
  result.then((data) => {
    res.send(data);
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
