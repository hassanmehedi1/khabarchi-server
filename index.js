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

    //GET
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

    //update
    //delivered by one one
    app.put("/food/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const newQuantity = req.body;
      console.log(newQuantity);

      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: newQuantity.quantity - 1,
        },
      };
      const result = await foodCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

     app.put("/update/:id", async (req, res) => {
       const id = req.params.id;
       console.log(id);

       const newQuantity = req.body;
       console.log(newQuantity);
       const filter = { _id: ObjectId(id) };
       const option = { upsert: true };
       const updateDoc = {
         $set: {
           quantity: newQuantity.newQuantity,
         },
       };
       const result = await foodCollection.updateOne(
         filter,
         updateDoc,
         option
       );
       res.send(result);
     });

    //POST
    app.post("/food", async (req, res) => {
      const newFood = req.body;
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    });

    //DELETE
    app.delete("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
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
