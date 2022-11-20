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

//------------Modify shift
schedule.put('/:id/edit/:shiftId', (req, res) => {
   Employee.findById(
      req.params.id, (error, foundEmployee) => {
         let id = req.params.shiftId
         for (let i = 0; i<foundEmployee.schedule.length; i++){
            let shift = foundEmployee.schedule[i]
            if (shift.id === id){
               Employee.update(
                  {foundEmployee.schedule[i]:id},
                  {$set:{
                     name:req.body.name,
                     start:req.bodystart,
                     end:req.body.end,
                     period:req.body.period
                  }},
                  (error, shift) => {
                     res.json(shift)
                     console.log(shift);
                  }
               )
            }
         }
      }
   )
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
