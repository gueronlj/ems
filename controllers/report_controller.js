const express = require('express')
const report = express.Router()
const Employee = require('../models/employee.js')
const {differenceInMinutes, parseISO} = require('date-fns');

//----------Create report of shifts in between 2 given dates
report.get('/:id/:start/:end',(req, res) => {
   Employee.findById(req.params.id,(error, data) => {
      startLimit = (req.params.start)
      endLimit = (req.params.end)

      if(error){
         res.json(error)
      }else{
         const filteredList = data.schedule.filter(shift => (
            //if shift.date is in between filterStart and filterEnd, map to new array
            shift.date>=startLimit && shift.date<=endLimit
         ))
         let totalHours = 0
         let totalDailyWages = data.perDiem * filteredList.length
         let totalHourlyWages = data.perHour * totalHours
         filteredList.forEach((shift) => {
           if(shift.start && shift.end){
              let startTime = parseISO(shift.start)
              let endTime = parseISO(shift.end)
              let hoursInShift = (differenceInMinutes(endTime, startTime)/60).toPrecision(4)
              totalHours += parseFloat(hoursInShift)  
           }
         })
         res.json({
           schedule:filteredList,
           totalDays:filteredList.length,
           totalHours: totalHours,
           totalDailyWages: totalDailyWages,
           totalHourlyWages: totalHours * data.perHour
         })
      }
   })
})
module.exports = report
