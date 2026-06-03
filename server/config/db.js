const mongoose = require('mongoose');

const connectDatabase = async (mongoUri) => {
    if (!mongoUri) {
        throw new Error('MONGO_URI is required to connect to the database.');
    }

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectDatabase;
