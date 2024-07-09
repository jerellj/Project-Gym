const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Dit zorgt ervoor dat we JSON data kunnen verwerken

// Connectie met MongoDB
mongoose.connect('mongodb://localhost:27017/training-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definieer de schema's
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String, // 'trainer' of 'klant'
});

const TrainingScheduleSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    exercises: Array,
    date: Date,
});

const User = mongoose.model('User', UserSchema);
const TrainingSchedule = mongoose.model('TrainingSchedule', TrainingScheduleSchema);

// Endpoint om een trainingsschema te maken
app.post('/training-schedules', (req, res) => {
    const { userId, exercises } = req.body; // We verwachten userId en oefeningen in de body van het verzoek

    // Maak een nieuw trainingsschema
    const newTrainingSchedule = new TrainingSchedule({
        userId: userId,
        exercises: exercises,
        date: new Date() // Stel de huidige datum in
    });

    // Sla het nieuwe schema op in de database
    newTrainingSchedule.save((err) => {
        if (err) {
            return res.status(500).send("Er is iets misgegaan bij het opslaan van het schema.");
        }
        res.status(200).send("Het trainingsschema is succesvol opgeslagen!");
    });
});

// Start de server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});