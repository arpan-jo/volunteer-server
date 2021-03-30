const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5blll.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

client.connect(err => {
   console.log(err);
   const eventsCollection = client.db('volunteer').collection('events');

   app.get('/home', (req, res) => {
      eventsCollection.find({}).toArray((err, items) => {
         res.send(items);
      });
   });

   app.post('/addEvents', (req, res) => {
      const eventData = req.body;
      console.log(eventData);
      eventsCollection.insertOne(eventData).then(result => {
         console.log(result.insertedCount);
      });
   });

   app.delete('/deleteEvent/:id', (req, res) => {
      const id = req.params.id;
      console.log(id);
      eventsCollection.deleteOne({ _id: ObjectID(id) }).then(result => {
         console.log(result);
      });
   });
});

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.listen(process.env.PORT || 2050);
