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

const db = client.db("ThunderCars");
const tasks = client.db("Todo").collection("Tasks");

app.get("/", async (req, res) => {
  const all_tasks = await db.collection("Brands").find({});
  res.send(await all_tasks.toArray());
});

app.get("/products/:id", async (req, res) => {
  const all_tasks = await db.collection(req.params.id).find({});
  res.send(await all_tasks.toArray());
});

app.post("/products", async (req, res) => {
  const doc = req.body;
  const p = await db.collection(doc.brand_name).insertOne(doc);
  res.send(p);
});

app.get("/carts/:id", async (req, res) => {
  const email = req.params.id;
  const p = await db.collection(email).find({});
  res.send(await p.toArray());
});

app.post("/carts", async (req, res) => {
  const doc = req.body;
  const { _id, email, ...cartData } = doc;
  const p = await db.collection(email).insertOne(cartData);
  res.send(p);
});

app.get("/details/:id", async (req, res) => {
  const [cname, id] = req.params.id.split("-");
  const p = await db.collection(cname).findOne({ _id: new ObjectId(id) });
  res.send(p);
});

app.put("/update/:id", async (req, res) => {
  const p = await tasks.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(JSON.stringify(p));
});

app.delete("/delete/:id", async (req, res) => {
  const p = await tasks.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(JSON.stringify(p));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
