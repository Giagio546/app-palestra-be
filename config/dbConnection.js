const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        console.log('Trying to connect to MongoDB at', process.env.CONNECTION_STRING);
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected: ", connect.connection.host, connect.connection.name)
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb