import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    { nombre: { type: String, required: true }, 
    apellido: { type: String, required: true },
    edad: { type: Number, required: true }, 
    dni: { type: String, required: true, unique: true }, 
     });

const User = mongoose.model('User', userSchema);


export default User;