const express = require('express')
const schedule = express.Router()
const Employee = require('../models/employee.js')

//-------------Add shift to employee schedule
schedule.put('/:id/new-shift',(req, res) => {
   let timeStrings = [req.body.start, req.body.end ]
   const timeDecimals = timeStrings.map((string) => {
      new Date(string).getTime()
   })

   let period = req.body.period
   let date = req.body.date
   Employee.findOne(
      {id:req.params.id},(error, employee) => {
         if(error){
            res.json(error)
         }else{
            let object = {date: date, start:timeStrings[0], end:timeStrings[1], period:period}
            employee.schedule.push(object)
            employee.save()
            res.json(employee)
         }
      }
   )
})

//-------------Remove shift
//TODO:Change from date to some kind of unique ID
schedule.put('/:id/remove', (req, res) => {
   let id = req.body.start
   Employee.findOne(
      {id:req.params.id},(error, employee) => {
         const findIndex = () => {
            for (let i = 0; i<employee.schedule.length; i++){
               if (employee.schedule.start === id ){
                  return i
               }
            }
         }
         employee.schedule.splice(findIndex(),1)
         employee.save()
         res.json(employee)
      })
})

module.exports = schedule
