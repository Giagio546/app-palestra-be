const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        console.log("trying to connect to db:", process.env.CONNECTION_STRING);
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("Database connected:", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;