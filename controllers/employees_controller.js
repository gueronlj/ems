const express = require('express')
const admin = express.Router()
const Employee = require('../models/employee.js')

// -------------SHOW ALL EMPLOYEES
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

// -------------SHOW EMPLOYEE DETAILS
admin.get('/:id',(req, res) => {
   Employee.findById(req.params.id,(error, data) => {
      if(error){
         res.json(error)
      }else{
         res.json(data)
      }
   })
})


// -------------ADD NEW EMPLOYEE
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

//-------------UPDATE EMPLOYEE
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

//-------------Add shift to employee schedule
admin.put('/:id/new-shift',(req, res) => {
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
admin.put('/:id/search-date', (req, res) => {
   let date = req.body.date
   Employee.findOne(
      {id:req.params.id},(error, employee) => {
         const findIndex = () => {
            for (let i = 0; i<employee.schedule.length; i++){
               if (employee.schedule.date === date ){
                  console.log(i);
                  return i
               }
            }
         }
         employee.schedule.splice(findIndex(),1)
         employee.save()
         res.json(employee)
      })
})

//----------Create Report
admin.get('/:id/report',(req, res) => {
   Employee.findById(req.params.id,(error, data) => {
      if(error){
         res.json(error)
      }else{
         //This makes Grand Total calculations for a single employee
            let totalHours = 0
            let totalLunch = 0
            let totalDinner = 0
            let totalDouble = 0
            let totalShiftWages = 0

            data.schedule.forEach(element => {
               let end = new Date(element.end)
               let start = new Date(element.start)
               let hours = end.getHours()-start.getHours()
               let minutes = Math.abs(end.getMinutes()-start.getMinutes())
   
               if(element.period == 'lunch'){
                  totalHours += (hours+(minutes/60))
                  totalLunch ++
                  totalShiftWages += data.perDiem
               }
               if(element.period == 'dinner'){
                  totalHours += hours
                  totalDinner ++
                  totalShiftWages += data.perDiem
               }
               if(element.period == 'double'){
                  totalHours += hours
                  totalDouble ++
                  totalShiftWages += (data.perDiem * 1.5)
               }
            })
            totalHourlyWages = totalHours * data.perHour
            let report={
               totalHours: totalHours,
               totalLunch: totalLunch,
               totalDinner: totalDinner,
               totalDouble: totalDouble,
               totalHourlyWages: totalHourlyWages,
               totalShiftWages: totalShiftWages,
            }
         res.json(report)
      }
   })
})

module.exports = admin
