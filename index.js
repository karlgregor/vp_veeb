const express = require('express')
const app = express()
const port = 5221

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/test', (req, res) => {
  res.render('test', { 
    title: 'test title',
    message: 'Hello from Express!',
    items: ['item1', 'item2', 'item3']
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
