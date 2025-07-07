import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT : process.env.PORT || 3000,
    DB_URL :process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase',
    CLERK_API : process.env.CLERK_API ,
    CLERK_KEY : process.env.CLERK_KEY ,
    ARCJET_API : process.env.ARCJET_API ,
    ARCJET_KEY : process.env.ARCJET_KEY ,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME ,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY ,   
    CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET ,

 }