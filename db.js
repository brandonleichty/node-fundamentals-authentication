import mongo from "mongodb";

const { MongoClient } = mongo;

const url = process.env.MONGO_URL;

export const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectDb() {
  try {
    await client.connect();
    // confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to Mongo DB 🚀");
  } catch (error) {
    console.error(error);

    // If there is a problem close the connection
    await client.close();
  }
}
