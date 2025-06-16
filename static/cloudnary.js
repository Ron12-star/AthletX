import {v2 as cloudinary} from "cloudinary"
import fs from"fs";

cloudnary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadoncloudnary=async(localfile)=>{
try {
  if(!localfile) return null;

  //upload file on cloudnary
 const response= await cloudinary.uploader.upload(localfile,{
  resource_type:"auto"
 })
 //file hase been upload succefull
 console.log("file is uploaded on cloudinary")
 return response;
} catch (error) {
  fs.unlinkSync(localfile);//remove the locally saved temporary file as the upload operation got failed
  return null;
  
}
}

export {uploadoncloudnary};