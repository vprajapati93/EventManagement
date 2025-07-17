require('dotenv').config({path:'../.env'})
const v2 = require('cloudinary')
const fs = require('fs')



v2.config({
    cloud_name:`${process.env.CLOUD_NAME}`,
    api_key: `${process.env.API_KEY}`,
    api_secret:`${process.env.SECRET}`,
})

const uploadOnCloudinary =async (localfilePath) =>{
    try {
        if(!localfilePath) return null;
        const response = await v2.uploader.upload(localfilePath,{
            resource_type: 'raw',
        })
        return response;
    } catch (error) {
        fs.unlinkSync(localfilePath);
        return null;
    }
}


module.exports = uploadOnCloudinary;