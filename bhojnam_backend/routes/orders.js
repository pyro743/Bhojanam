const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')

const orderModel= require('../models/orderModel')

const auth=require('../auth')

router.get('/',function(req,res)
{
    orderModel.find()
    .select('-__v ')
    .exec()
    
    .then(orders=>{
        res.json(orders).status(200);
    })
});

router.post('/',auth,function(req,res){
const newOrder= new orderModel({
    supplier:req.body.supplier,
    noOfPerson:req.body.noOfPerson,
    time:req.body.time,
    delivery:null
});

    newOrder.save();
    res.json("Order Created").status(201);

})


router.get('/:orderID',function(req,res)
{
    const id=req.params.orderID;
    orderModel.findById(id)
    .exec()
    .then(order=>{
        res.json(order).status(200);
    })

})

router.put('/:orderID',auth,function(req,res)
{
    const id=req.params.orderID;
    const deliveryID=req.body.deliveryID;
    orderModel.updateOne({_id:id},{$set:{delivery:deliveryID}})
    .exec()
    .then(order=>{
        res.json(order).status(200);
    })

})


module.exports=router;

