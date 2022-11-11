const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
   name: String,
   phone: String,
   schedule: Array,
   perDiem: Number,
   perHour: Number,
})

const Employee = mongoose.model('Employee', employeeSchema)
module.exports = Employee;
