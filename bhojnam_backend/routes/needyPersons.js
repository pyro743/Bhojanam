const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const needyModel= require('../models/needyModel');


router.get('/',function(req,res)
{
    needyModel.find()
    .select('-__v ')
    .exec()
    
    .then(needyPerson=>{
        res.json(needyPerson).status(200);
    })
    
});




router.post('/',function(req,res)
{
    const newNeedyPerson = new needyModel({
        name: req.body.name,
        aadhar: req.body.aadhar,
        noOfPerson: req.body.noOfPerson,
        time: req.body.time
    });
    needyModel.find({ aadhar: req.body.aadhar })
        .exec()
        .then(needyPersons => 
            {
            if (needyPersons.length > 0) {
                res.send("Needy Person already exixts").status(400);
            }
            else {
                newNeedyPerson.save();
                res.send("New Needy Person Registerd Successfully").status(201);
            }
        })
});

module.exports=router;

