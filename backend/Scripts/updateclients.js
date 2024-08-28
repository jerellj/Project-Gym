const mongoose = require('mongoose');
const User = require('../models/User'); 
const CustomerDetails = require('../models/CustomerDetails');

mongoose.connect('mongodb://localhost:27017/training-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateExistingClients = async () => {
  try {
    const clients = await User.find({ role: 'klant', customerDetails: { $exists: false } });

    for (let client of clients) {
      // Maak een nieuw CustomerDetails object aan
      const customerDetails = new CustomerDetails({
        notes: '',
        injury: '',
        weight: null,
        illness: '',
        goals: '',
      });

      // Sla het CustomerDetails object op
      await customerDetails.save();

      // Koppel het nieuwe CustomerDetails object aan de klant
      client.customerDetails = customerDetails._id;
      await client.save();

      console.log(`CustomerDetails added for client: ${client.name}`);
    }

    console.log('Update completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating clients:', error);
    mongoose.connection.close();
  }
};

updateExistingClients();