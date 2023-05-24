const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0c5uddq.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const clientsCollection = client.db('dorkariBhai').collection('clients');
        const workersCollection = client.db('dorkariBhai').collection('workers');
        const worksCollection = client.db('dorkariBhai').collection('works');
        const appliesCollection = client.db('dorkariBhai').collection('applies');
        const messagesCollection = client.db('dorkariBhai').collection('messages');
        const repliesCollection = client.db('dorkariBhai').collection('replies');
        
        app.post('/client', async (req, res) => {
          const clientProfile = req.body;
          const result = await clientsCollection.insertOne(clientProfile);
          res.send(result);
        });

        app.get('/clients', async (req, res) => {
          const query = {};
          const cursor = clientsCollection.find(query);
          const clients = await cursor.toArray();
          res.send(clients);
        });

        app.get('/client/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const client = await clientsCollection.findOne(query);
        res.send(client);
      });

        app.get('/clientprofile', async (req, res) => {
          const email = req.query.clientEmail;
          const query = { clientEmail: email };
          const cursor = clientsCollection.find(query);
          const client = await cursor.toArray();
          res.send(client);
      });


      /***
       * Worker
       * ***/

      app.post('/worker', async (req, res) => {
        const workerProfile = req.body;
        const result = await workersCollection.insertOne(workerProfile);
        res.send(result);
      });

      app.get('/workers', async (req, res) => {
        const query = {};
        const cursor = workersCollection.find(query);
        const workers = await cursor.toArray();
        res.send(workers);
      });

      app.get('/workerprofile', async (req, res) => {
        const email = req.query.workerEmail;
        const query = { workerEmail: email };
        const cursor = workersCollection.find(query);
        const worker = await cursor.toArray();
        res.send(worker);
    });

    app.put('/accept-work/:id', async (req, res) => {
      const id = req.params.id;
      const accepted = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
            clientSentSelectionRequest: accepted.clientSentSelectionRequest,
            workStatus: accepted.workStatus,
            workerAccepted: accepted.workerAccepted,
            deliveryStatus: accepted.deliveryStatus,
             
          }
      };

      const result = await worksCollection.updateOne(filter, updatedDoc, options);
      res.send(result);

  });

  app.put('/cancel-work/:id', async (req, res) => {
    const id = req.params.id;
    const cancelled = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          clientSentSelectionRequest: cancelled.clientSentSelectionRequest,
          workStatus: cancelled.workStatus,
          whoCancelled: cancelled.whoCancelled,
          refundStatus: cancelled.refundStatus,
          clientPaidToWorker: cancelled.clientPaidToWorker,
           
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});
  app.put('/delivery/:id', async (req, res) => {
    const id = req.params.id;
    const delivery = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          messageToClientFromWorker: delivery.messageToClientFromWorker,
          deliveryStatus: delivery.deliveryStatus,
           
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});
  app.put('/accept-delivery/:id', async (req, res) => {
    const id = req.params.id;
    const clientacceptdelivery = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          clientPaidToWorker: clientacceptdelivery.clientPaidToWorker,
          refundStatus: clientacceptdelivery.refundStatus,
          PaymentTransferStatus: clientacceptdelivery.PaymentTransferStatus,
          deliveryStatus: clientacceptdelivery.deliveryStatus,
          workStatus: clientacceptdelivery.workStatus,
          releasedAmount: clientacceptdelivery.releasedAmount,
          buyerReviewPostedtoWorker: clientacceptdelivery.buyerReviewPostedtoWorker,
          workerReviewPostedtoClient: clientacceptdelivery.workerReviewPostedtoClient,
           
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});
  app.put('/client-post-review/:id', async (req, res) => {
    const id = req.params.id;
    const clientPostReview = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          buyerReviewPostedtoWorker: clientPostReview.buyerReviewPostedtoWorker,
          rate: clientPostReview.rate,
          review: clientPostReview.review,
           
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});
  app.put('/worker-post-review/:id', async (req, res) => {
    const id = req.params.id;
    const workerPostReview = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          workerReviewPostedtoClient: workerPostReview.workerReviewPostedtoClient,
          workerRate: workerPostReview.workerRate,
          workerReview: workerPostReview.workerReview,
           
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});


/*****
 * Admin Section
*****/
  app.put('/payment-transferred/:id', async (req, res) => {
    const id = req.params.id;
    const paymentTransferred = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          PaymentTransferStatus: paymentTransferred.PaymentTransferStatus, 
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});
  app.put('/payment-refund/:id', async (req, res) => {
    const id = req.params.id;
    const paymentRefunded = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          refundStatus: paymentRefunded.refundStatus, 
          depositStatus: paymentRefunded.depositStatus, 
        }
    };

    const result = await worksCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

});




      /***
       * Workers
       * ****/

      app.get('/worker/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const worker = await workersCollection.findOne(query);
        res.send(worker)
      });

      
      /***
       * Works
       * ****/

      app.post('/postwork', async (req, res) => {
        const work = req.body;
        const result = await worksCollection.insertOne(work);
        res.send(result);
      });

      app.get('/works', async (req, res) => {
        const query = {};
        const cursor = worksCollection.find(query);
        const works = await cursor.toArray();
        res.send(works);
      });

      app.get('/work/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const work = await worksCollection.findOne(query);
        res.send(work)
      });

      app.put('/select-worker/:id', async (req, res) => {
        const id = req.params.id;
        const selectWorker = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
              workerName: selectWorker.workerName,
              workerId: selectWorker.workerId,
              workerEmail: selectWorker.workerEmail,
              amount: selectWorker.amount,
              clientSentSelectionRequest: selectWorker.clientSentSelectionRequest,
              clientPaidToWorker: selectWorker.clientPaidToWorker,
              depositStatus: selectWorker.depositStatus,
               
            }
        };

        const result = await worksCollection.updateOne(filter, updatedDoc, options);
        res.send(result);

    });

      /****
       * Deposit
       * ***/

      app.put('/deposit/:id', async (req, res) => {
        const id = req.params.id;
        const deposit = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
              depositAmount: deposit.depositAmount,
              workStatus: deposit.workStatus,
              depositStatus: deposit.depositStatus,
            }
        };

        const result = await worksCollection.updateOne(filter, updatedDoc, options);
        res.send(result);

    });

      /****
       * Message
       * ***/
         app.post('/new-message-client', async (req, res) => {
          const clientMessage = req.body;
          const result = await messagesCollection.insertOne(clientMessage);
          res.send(result);
        });
        
         app.post('/new-message-worker', async (req, res) => {
          const workerMessage = req.body;
          const result = await messagesCollection.insertOne(workerMessage);
          res.send(result);
        });

        app.get('/messages', async (req, res) => {
        const query = {};
        const cursor = messagesCollection.find(query);
        const messages = await cursor.toArray();
        res.send(messages);
      });
      /****
       * Replies
       * ***/
         app.post('/new-reply', async (req, res) => {
          const newReply = req.body;
          const result = await repliesCollection.insertOne(newReply);
          res.send(result);
        });
        
         

        app.get('/replies', async (req, res) => {
        const query = {};
        const cursor = repliesCollection.find(query);
        const replies = await cursor.toArray();
        res.send(replies);
      });


      /****
       * Apply to Work
       * ***/

      app.post('/apply-work', async (req, res) => {
        const apply = req.body;
        const result = await appliesCollection.insertOne(apply);
        res.send(result);
      });

      app.get('/applies-work', async (req, res) => {
        const query = {};
        const cursor = appliesCollection.find(query);
        const applies = await cursor.toArray();
        res.send(applies);
      });

      app.get('/apply/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const apply = await appliesCollection.findOne(query);
        res.send(apply)
      });
     
        
    }

    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('DorkariBhai')
})

app.listen(port, () => {
  console.log(`DorkariBhai is Live ${port}`)
})