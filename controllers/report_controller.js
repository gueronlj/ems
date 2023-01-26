const express = require('express')
const report = express.Router()
const Employee = require('../models/employee.js')
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
         res.json(filteredList)
      }
   })
})
module.exports = report
