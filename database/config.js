const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const dbconnection = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Database Connected!');
    } catch(error){
        throw new Error(error);
    }
} 

module.exports = {
    dbconnection
};