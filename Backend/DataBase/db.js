import mongoose from "mongoose";

let isConnected = false
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/ElectroMartDB`, {
            useNewUrlParser: true,
            useUndefinedTopology: true
        });
        isConnected = true
        console.log("MongoDb connected successfully")
    }
    catch (error) {
        console.log("MongoBD connection failed : ", error)
    }
}

export default connectDB;