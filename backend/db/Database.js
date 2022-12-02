const mongoose = require("mongoose");


const connectDatabase = () =>{
    mongoose.connect('mongodb+srv://sethu:sethu@cluster0.206kf.mongodb.net/shopeasy',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((data) =>{
        console.log(`mongodb is connected with server: ${data.connection.host}`);
    })
}

module.exports = connectDatabase
