const mongoose = require("mongoose");
require("dotenv").config();
exports.connect= () => {
       mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
       })
       .then(()=> console.log("DB Connection succesfull"))
       .catch( (error) => {
          console.log("DBconnection failed");
          console.error(error);
          process.exit(1);

       })
}