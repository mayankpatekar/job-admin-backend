const express= require('express');
const {Type} = require("../models/models.js");

const router = express.Router();

// type getter and setter
router.post('/',async(req,res)=>{
    const {type} = req.body;
    try{

        const types = new Type({
            type:type
        });
        types.save();
        res.status(200).json({message:"New type added"});

    }catch(err){
        res.status(422).json({message:"Can't create type"})
    }
})
router.get("/",async(req,res)=>{
    try{
        const types = await Type.find();
        
        res.status(200).json({
            types:types
        })
    }catch(err){
        console.log(err);
        res.status(400).json({message:"not found"})
    }
});



module.exports = router