import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.minitype.startsWith("image/")){
        cb(null , true);


    }else{
        cb(new Error("Only images file are allowed" , false))
    }
} 

const upload = multer({
    storage : storage , 
    fileFilter : fileFilter , 
    limits : {fileSize : 5* 1.24*1024} // yaha par 5MB ka limit set kiya hai
})

export default upload;