const mongoose = require('mongoose');
const User = require('../models/User'); // Pad naar je User-model
const CustomerDetails = require('../models/CustomerDetails'); // Pad naar je CustomerDetails-model

const userId = '66871d30eaf07f89a04fe36a';
const notes = 'jr moet meer trainen';
const injury  = 'ingegroeide teennagel';
const weight = 105;
const illness = 'vlek tyfus';
const goals = 'dik worden';

// Verbinding maken met de MongoDB database
mongoose.connect('mongodb://localhost:27017/training-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB connected');

    try {
        // Vind de gebruiker en populaten van customerDetails
        const user = await User.findById(userId).populate('customerDetails');
        if (!user || user.role !== 'klant') {
            console.log('Klant niet gevonden');
            return;
        }

        if (user.customerDetails) {
            // Update bestaande klantgegevens
            const customerDetails = await CustomerDetails.findById(user.customerDetails._id);
            customerDetails.notes = notes;
            customerDetails.injury = injury;
            customerDetails.weight = weight;
            customerDetails.illness = illness;
            customerDetails.goals = goals;

            console.log('Before saving customer details:', customerDetails);
            await customerDetails.save();
        } else {
            // Maak nieuwe klantgegevens aan als deze nog niet bestaan
            const customerDetails = new CustomerDetails({ user: userId, notes, injury, weight, illness, goals });
            await customerDetails.save();
            user.customerDetails = customerDetails._id;
            await user.save();
        }

        const updatedUser = await User.findById(userId).populate('customerDetails');
        console.log('Klantdetails succesvol bijgewerkt:', updatedUser.customerDetails);
    } catch (error) {
        console.error('Error updating customer details:', error);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('Connection error', err);
});