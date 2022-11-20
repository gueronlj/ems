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
   Employee.findById(req.params.id,(error, employee) => {
         if(error){
            res.json(error)
         }else{
            let object = { id:(Math.random()*(100000-1)+1).toString(), date: date, start:timeStrings[0], end:timeStrings[1], period:period}
            employee.schedule.push(object)
            employee.save()
            res.json(employee)
         }
      }
   )
})

//-------------Remove shift
schedule.put('/:id/remove/:shiftId', (req, res) => {
   let id = req.params.shiftId
   Employee.findById(
      req.params.id,(error, employee) => {
         const findIndex = () => {
            for (let i = 0; i<employee.schedule.length; i++){
               if (employee.schedule[i].id === id){
                  return i
               }
            }
         }
         employee.schedule.splice(findIndex(),1)
         employee.save()
         res.json(employee)
      })
})

//---------------Modify shift
schedule.put('/:id/edit/:shiftId', (req, res) => {
   const query = {"schedule.id":req.params.shiftId}
   const update = {
      "$set":{
         "schedule.$.id":req.params.shiftId,
         "schedule.$.date":req.body.date,
         "schedule.$.start":req.body.start,
         "schedule.$.end":req.body.end,
         "schedule.$.period":req.body.period,
      }
   }
   Employee.updateOne(query, update, (error, employee) => {
      if(error){console.log(error);}
      else{
         Employee.findById(
            req.params.id, (error, employee) => {
               res.json(employee.schedule)
            }
         )
      }
   })
})

//------------get shift info
schedule.get('/:id/:shiftId', (req, res) => {
   let id = req.params.shiftId
   Employee.findById(
      req.params.id, (error, employee) => {
         const findShift = () => {
            for (let i = 0; i<employee.schedule.length; i++){
               if (employee.schedule[i].id === id){
                  return employee.schedule[i]
               }
            }
         }
         res.json(findShift())
      }
   )
})

module.exports = schedule
