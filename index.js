import express from 'express';

import 'dotenv/config'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json())
const port = 8000



const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("kindora")
const eventsCollection = db.collection("events")
// http://localhost:8000/get-events
// http://localhost:8000/get-event/:email
// http://localhost:8000/update-event/:email
// http://localhost:8000/delete-event/:email
// http://localhost:8000/my-joined-events
const joinedEventsCollection = db.collection("joinedEvents");

// Prevent duplicate registrations
await joinedEventsCollection.createIndex(
    { eventId: 1, userId: 1 },
    { unique: true }
);

app.get("/my-joined-events", async (req, res) => {
    try {
        const userId = req.user.id;

        const joinedEvents = await joinedEventsCollection.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $addFields: {
                    eventObjectId: {
                        $convert: {
                            input: "$eventId",
                            to: "objectId",
                            onError: null,
                            onNull: null,
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "events",
                    localField: "eventObjectId",
                    foreignField: "_id",
                    as: "event",
                },
            },
            {
                $unwind: "$event",
            },
            {
                $replaceRoot: {
                    newRoot: "$event",
                },
            },
            {
                $sort: {
                    eventDate: 1,
                },
            },
        ]).toArray();

        res.status(200).send(joinedEvents);

    } catch (error) {
        console.error("Get joined events error:", error);

        res.status(500).send({
            message: "Failed to fetch joined events.",
        });
    }
});
 

app.post("/join-event", async (req, res) => {
    try {
        const { eventId, user } = req.body;

        if (!eventId || !user?.id || !user?.email) {
            return res.status(400).send({
                message: "Event and user information are required.",
            });
        }

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).send({
                message: "Invalid event ID.",
            });
        }

        // Check whether the event exists
        const event = await eventsCollection.findOne({
            _id: new ObjectId(eventId),
        });

        if (!event) {
            return res.status(404).send({
                message: "Event not found.",
            });
        }

        // Check whether this user already joined
        const existingJoin = await joinedEventsCollection.findOne({
            eventId,
            userId: user.id,
        });

        if (existingJoin) {
            return res.status(409).send({
                message: "You have already joined this event.",
            });
        }

        const joinedEvent = {
            eventId,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userImage: user.image || "",
            joinedAt: new Date(),
        };

        const result = await joinedEventsCollection.insertOne(joinedEvent);

        res.status(201).send({
            message: "You successfully joined the event!",
            insertedId: result.insertedId,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({
                message: "You have already joined this event.",
            });
        }

        console.error("Join event error:", error);

        res.status(500).send({
            message: "Failed to join event.",
        });
    }
});


app.get("/get-event-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid event ID" });
        }

        const event = await eventsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }

        res.send(event);
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch event" });
    }
});

app.post('/create-event', async (req, res) => {
    const data = req.body;
    const result = await eventsCollection.insertOne(data);
    console.log(result)
    res.send(result)
})

app.get('/get-event/:email', async (req, res) => {
    const email = req.params.email;
    const result = await eventsCollection.find({ creatorEmail: email }).toArray();
    res.send(result)
})

// app.patch('/update-event/:email', async (req, res) => {
//     const email = req.params.email;
//     const updateData = req.body;
//     const result = await eventsCollection.updateOne({creatorEmail: email}, {$set: updateData});
//     res.send(result);
// });

// app.delete('/delete-event/:email', async (req, res) => {
//     const email = req.params.email;
//     const result = await eventsCollection.deleteOne({creatorEmail: email});
//     res.send(result);
// });


app.patch('/update-event/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const { eventId, ...updateData } = req.body;

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).send({
                message: "Invalid event ID"
            });
        }

        const result = await eventsCollection.updateOne(
            {
                _id: new ObjectId(eventId),
                creatorEmail: email
            },
            {
                $set: updateData
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({
                message: "Event not found"
            });
        }

        res.send({
            message: "Event updated successfully",
            result
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Failed to update event"
        });
    }
});


app.delete('/delete-event/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const { eventId } = req.body;

        if (!ObjectId.isValid(eventId)) {
            return res.status(400).send({
                message: "Invalid event ID"
            });
        }

        const result = await eventsCollection.deleteOne({
            _id: new ObjectId(eventId),
            creatorEmail: email
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "Event not found"
            });
        }

        res.send({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Failed to delete event"
        });
    }
});


app.get('/get-events', async (req, res) => {
    const result = await eventsCollection.find().toArray();
    res.send(result)
})



app.get('/', (req, res) => {
    res.send({ message: 'Hello World!' })
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})