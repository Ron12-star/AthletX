const Mongoose=require ('mongoose');

const connectDB = async () => {
  await Mongoose
    .connect(
      process.env.MONGODB_URI
    )
    .then(() => console.log("MongoDB connected:"))
    .catch((error) => console.log(error.message));
};
module.exports=(connectDB);