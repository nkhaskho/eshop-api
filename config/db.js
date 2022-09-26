const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
        };
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.259shaz.mongodb.net/?retryWrites=true&w=majority`, connectionParams);
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database", error);
    }
};