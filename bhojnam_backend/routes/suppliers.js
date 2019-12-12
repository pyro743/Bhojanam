const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const mongoose = require('mongoose');
const supplierModel = require('../models/supplierModel');

const jwt=require('jsonwebtoken');

router.get('/', function (req, res) {
    res.send("Supplier's home").status(200);
});


router.post('/', function (req, res)
 {
    const newSupplier = new supplierModel({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: bcryptjs.hashSync(req.body.password, 10),
        address: req.body.address
    })


    supplierModel.find({ mobile: req.body.mobile })
        .exec()
        .then(suppliers => 
            {
            if (suppliers.length > 0) {
                res.send("User already exixts").status(400);
            }
            else {
                newSupplier.save();
                res.send("User Created Successfully").status(201);
            }
        })
});


router.post('/signin',function(req,res){
    supplierModel.findOne({mobile:req.body.mobile})
    .exec()
    .then(supplier=>{
        if(supplier==null)
        {
            
            
            res.send("Auth failed").status(401);
        }
        else{
           if(bcryptjs.compareSync(req.body.password,supplier.password))
           {
               //using synchronous function
               const token=jwt.sign(
                {
                    mobile:supplier.mobile,
                    _id:supplier._id
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

module.exports = router;