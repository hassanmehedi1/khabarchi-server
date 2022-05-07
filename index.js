const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ecv2a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const foodCollection = client.db("foodInventory").collection("food");

    app.get("/food", async (req, res) => {
      const query = {};
      const cursor = foodCollection.find(query);
      const foods = await cursor.toArray();
      res.send(foods);
    });

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const food = await foodCollection.findOne(query);
      res.send(food);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Server Is Running");
});

app.listen(port, () => {
  console.log("Port server running", port);
});
