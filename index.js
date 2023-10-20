import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import cors from "cors";
import { config } from "dotenv";

config({
  path: ".env.local",
});

// eslint-disable-next-line no-undef
const uri = process.env.DB_URI;

const app = express();

// eslint-disable-next-line no-undef
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   }
// }run().catch(console.dir);

const tasks = client.db("Todo").collection("Tasks");

app.get("/", async (req, res) => {
  const all_tasks = await tasks.find({});
  res.send(JSON.stringify(await all_tasks.toArray()));
});

app.post("/", async (req, res) => {
  const doc = req.body;
  const p = await tasks.insertOne(doc);
  res.send(p);
});

app.get("/view/:id", async (req, res) => {
  const p = await tasks.findOne({ _id: new ObjectId(req.params.id) });
  res.send(JSON.stringify(p));
});

app.delete("/delete/:id", async (req, res) => {
  const p = await tasks.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(JSON.stringify(p));
});

app.put("/update/:id", async (req, res) => {
  const p = await tasks.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(JSON.stringify(p));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
