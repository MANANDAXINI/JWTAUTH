const mongoose=require("mongoose")

const connectdb=async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/jwtauth2')
        console.log('mongodb connected');
    } catch (error) {
        console.log("error ",error)
    }
}

module.exports={connectdb}