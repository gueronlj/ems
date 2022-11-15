const express = require('express')
const report = express.Router()
const Employee = require('../models/employee.js')

//----------Create Report
report.get('/:id',(req, res) => {
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
module.exports = report
