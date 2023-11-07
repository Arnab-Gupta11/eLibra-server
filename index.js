const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

/*-------------------> middleware <----------------------*/
app.use(cors());
app.use(express.json());

/*-------------------> Connect to Database <----------------------*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cliw5jo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const categoryCollection = client.db("LibraryDB").collection("categories");
    const booksCollection = client.db("LibraryDB").collection("books");
    const reviewsCollection = client.db("LibraryDB").collection("reviews");
    const borrowCollection = client.db("LibraryDB").collection("borrowBooks");

    /*-------------------> Get operation <----------------------*/

    app.get("/categories", async (req, res) => {
      try {
        const cursor = categoryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });
    app.get("/books", async (req, res) => {
      try {
        const result = await booksCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });
    app.get("/borrows", async (req, res) => {
      try {
        const result = await borrowCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });
    app.get("/reviews", async (req, res) => {
      try {
        const result = await reviewsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/books/category/:categoryName", async (req, res) => {
      try {
        const categoryName = req.params.categoryName;
        const query = { category: categoryName };
        const result = await booksCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    /*-------------------> Post operation <----------------------*/
    app.post("/books", async (req, res) => {
      try {
        const newBook = req.body;
        const result = await booksCollection.insertOne(newBook);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });
    app.post("/borrows", async (req, res) => {
      try {
        const newBorrowBook = req.body;
        const result = await borrowCollection.insertOne(newBorrowBook);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    /*-------------------> Put operation <----------------------*/
    app.put("/books/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBook = req.body;
      const book = {
        $set: {
          ...updatedBook,
        },
      };
      const result = await booksCollection.updateOne(filter, book, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

/*-------------------> Home API <----------------------*/
app.get("/", async (req, res) => {
  res.send("Library management server is running");
});
app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
