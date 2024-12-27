const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const parcelRoute = require("./routes/parcel")
const { sendWelcomeEmail } = require("./EmailService/WelcomeEmail");
const { SendParcelPendingEmail } = require("./EmailService/PendingParcel");
const { sendParcelDeliveredEmail } = require("./EmailService/DeliveredParcel");

dotenv.config();
const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json());

//ROUTES

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/users",userRoute)
app.use("/api/v1/parcels",parcelRoute)

//DATABASE CONNECTION
const DB=process.env.DB;
mongoose.connect(DB).then(()=>{
    console.log("DB connection is successful");
}).catch((err)=>{
    console.log(err)
})



//TASK SCHEDULER

const run = () => {
    cron.schedule("* * * * *", () => {
      sendWelcomeEmail()
      SendParcelPendingEmail()
      sendParcelDeliveredEmail()
    });
  };
  
  run();




//SERVER

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})



