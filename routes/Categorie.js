const express= require('express');
const { Categorie } = require("../models/models.js");

const router = express.Router();

// type getter and setter
router.post('/',async(req,res)=>{
    const {categorie} = req.body;
    try{

        const categories = new Categorie({
            categorie:categorie
        });
        categories.save();
        res.status(200).json({message:"New category added"});

    }catch(err){
        res.status(422).json({message:"Can't create category"})
    }
})
router.get("/",async(req,res)=>{
    try{
        const categories = await Categorie.find();
        
        res.status(200).json({
            categories:categories
        })
    }catch(err){
        console.log(err);
        res.status(400).json({message:"not found"})
    }
});



module.exports = router