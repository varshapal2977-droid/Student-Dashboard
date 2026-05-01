const router = require('express').Router()
const Assignment = require('../models/Assignment')
const auth = require('../middleware/auth')

router.use(auth)

router.get('/', async (req, res) => {
  const assignments = await Assignment.find({ user: req.user.id }).populate('course', 'name code color')
  res.json(assignments)
})

router.post('/', async (req, res) => {
  try {
    const a = await Assignment.create({ ...req.body, user: req.user.id })
    res.status(201).json(a)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
  const a = await Assignment.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true })
  if (!a) return res.status(404).json({ error: 'Not found' })
  res.json(a)
})

router.delete('/:id', async (req, res) => {
  const a = await Assignment.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!a) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

module.exports = router
