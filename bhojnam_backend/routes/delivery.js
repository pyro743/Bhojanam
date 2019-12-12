const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const bcryptjs = require('bcryptjs');
const deliveryModel= require('../models/deliveryModel')
const jwt=require('jsonwebtoken');


const auth=require('../auth')

router.get('/',function(req,res)
{
    res.send("Delivery Home").status(200);
});

router.post('/', function (req, res)
 {
    const newDelivery = new deliveryModel({
        name: req.body.name,
        mobile: req.body.mobile,
        password: bcryptjs.hashSync(req.body.password, 10),
        address: req.body.address
    })


    deliveryModel.find({ mobile: req.body.mobile })
        .exec()
        .then(delivery => 
            {
            if (delivery.length > 0) {
                res.send("Delivery User already exixts").status(400);
            }
            else {
                newDelivery.save();
                res.send("Delivery User Created Successfully").status(201);
            }
        })
});


router.post('/signin',function(req,res){
    deliveryModel.findOne({mobile:req.body.mobile})
    .exec()
    .then(delivery=>{
        if(delivery==null)
        {
            
            
            res.send("Auth failed").status(401);
        }
        else{
           if(bcryptjs.compareSync(req.body.password,delivery.password))
           {
               //using synchronous function
               const token=jwt.sign(
                {
                    mobile:delivery.mobile,
                    _id:delivery._id
            },
            'qwertyu',{
                expiresIn: '12h'
            }
            );


               res.json({
                   "message":"Auth Successfull",
                   "token":token
                   }).status(200);
               
           }
           else{
            res.send("Auth failed").status(401);
           }
        }
    })
});


module.exports=router;

