const router = require('express').Router()
const Course = require('../models/Course')
const auth = require('../middleware/auth')

router.use(auth)

router.get('/', async (req, res) => {
  const courses = await Course.find({ user: req.user.id })
  res.json(courses)
})

router.post('/', async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, user: req.user.id })
    res.status(201).json(course)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
  const course = await Course.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true })
  if (!course) return res.status(404).json({ error: 'Not found' })
  res.json(course)
})

router.delete('/:id', async (req, res) => {
  const course = await Course.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!course) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

module.exports = router
