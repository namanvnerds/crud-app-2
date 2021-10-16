const express = require('express')
const Student = require('./../models/student')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('students/new', { student: new Student() })
})

router.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id)
  res.render('students/edit', { student: student })
})

router.get('/:slug', async (req, res) => {
  const student = await Student.findOne({ slug: req.params.slug })
  if (student == null) res.redirect('/')
  res.render('students/show', { student: student })
})

router.post('/', async (req, res, next) => {
  req.student = new Student()
  next()
}, saveStudentAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.student = await Student.findById(req.params.id)
  next()
}, saveStudentAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.firstName)
  res.redirect('/')
})

function saveStudentAndRedirect(path) {
  return async (req, res) => {
    let student = req.student
    student.firstName = req.body.firstName
    student.lastName = req.body.lastName
    student.age = req.body.age
    student.mobileNo = req.body.mobileNo
    student.email = req.body.email
    student.profilePic = req.body.profilePic
    try {
      student = await student.save()
      res.redirect(`/students/${student.id}`)
    } catch (e) {
      res.render(`students/${path}`, { student: student })
    }
  }
}

module.exports = router