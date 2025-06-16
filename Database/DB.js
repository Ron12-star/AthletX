const Mongoose=require ('mongoose');

const connectDB = async () => {
  await Mongoose
    .connect(
      "mongodb+srv://ronakrathwa69:d5JYcxldMlqmDvEn@cluster0.1xdvo.mongodb.net/AthleteX"
    )
    .then(() => console.log("MongoDB connected:"))
    .catch((error) => console.log(error.message));
};
module.exports=(connectDB);