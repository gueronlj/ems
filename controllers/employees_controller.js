const express = require('express')
const admin = express.Router()
const Employee = require('../models/employee.js')

// SHOW ALL EMPLOYEES
admin.get('/',(req, res) => {
   Employee.find({}).sort({name:1}).exec((error, data) => {
      if(error){
         res.json(error)
         console.log(error);
      } else {
         res.json(data)
      }
   })
})

// SHOW EMPLOYEE DETAILS
admin.get('/:id',(req, res) => {
   Employee.findById(req.params.id,(error, data) => {
      if(error){
         res.json(error)
      }else{
         res.json(data)
      }
   })
})


// ADD NEW EMPLOYEE
admin.post('/new-employee', (req, res) => {
   Employee.create(req.body, (error, newEmployee) => {
      if(error){
         res.json(error)
      }else{
         console.log('Employee has been created');
         res.json(newEmployee)
      }
   })
})

//UPDATE EMPLOYEE
admin.put('/:id', (req, res) => {
   Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true},
      (error, updated) => {
         if(error){
            res.json(error)
         }else{
            res.json(updated)
         }
      }
   )
})

module.exports = admin
