const router = require('express').Router()
const Resource = require('../models/Resource')
const auth = require('../middleware/auth')

router.use(auth)

router.get('/', async (req, res) => {
  const resources = await Resource.find({ user: req.user.id }).populate('course', 'name code color')
  res.json(resources)
})

router.post('/', async (req, res) => {
  try {
    const r = await Resource.create({ ...req.body, user: req.user.id })
    res.status(201).json(r)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
  const r = await Resource.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true })
  if (!r) return res.status(404).json({ error: 'Not found' })
  res.json(r)
})

router.delete('/:id', async (req, res) => {
  const r = await Resource.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!r) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

module.exports = router
