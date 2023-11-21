const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect("mongodb://app-palestra-mongodb-1:27017/app-palestra");
        console.log("Database connected: ", connect.connection.host, connect.connection.name)
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb