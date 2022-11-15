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
   let date = req.body.date
   let start = req.body.start
   let end = req.body.end
   let period = req.body.period

   Employee.findOne(
      {id:req.params.id},(error, employee) => {
         if(error){
            res.json(error)
         }else{
            let object = {date: date, start:start, end:end, period:period}
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
            let totalHourlyWages = totalHours * data.perHour
            let totalShiftWages = 0
            data.schedule.forEach(element => {
               totalHours += (element.end-element.start)
               if(element.period == 'lunch'){
                  totalLunch ++
                  totalShiftWages += data.perDiem
               }
               if(element.period == 'dinner'){
                  totalDinner ++
                  totalShiftWages += data.perDiem
               }
               if(element.period == 'double'){
                  totalDouble ++
                  totalShiftWages += (data.perDiem * 1.5)
               }
            })
            totalHourlyWages = totalHours * data.perHour
            console.log(totalShiftWages);
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
