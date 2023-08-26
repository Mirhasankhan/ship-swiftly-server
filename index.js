const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())

// j0cmouPPW3Evuh6k
// shipSwiftly


const uri = "mongodb+srv://shipSwiftly:j0cmouPPW3Evuh6k@cluster0.cpvrkgd.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const shippingCollection = client.db('shipping-details').collection('shipping')

    app.post('/shippings', async(req, res)=>{
        const body = req.body;
        const result = await shippingCollection.insertOne(body)
        res.send(result)
    })

    app.get('/shippings', async(req, res)=>{
      const result = await shippingCollection.find().toArray()
      res.send(result)
    })

    app.post('/create-payment-intent', async(req, res)=>{
      const {totalCost} = req.body
      const amount = parseInt(totalCost *100);
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
      })
      res.send({
          clientSecret: paymentIntent.client_secret
      })
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server running at 5000');
})