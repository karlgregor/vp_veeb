const express = require('express')
const fs = require('fs')

const app = express()
const port = 5221

const dateEt = require('./src/dateTimeET')

const eestifilmRoutes = require('./routes/eestifilmRoutes')
const visitRoutes = require('./routes/visitRoutes')

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})


app.get('/timenow', (req, res) => {
  res.render('timenow', { 
    longDate: dateEt.longDate,
    weekDay: dateEt.weekDay,
    time: dateEt.time
  })
})

app.get('/vanasonad', (req, res) => {
  fs.readFile('public/txt/vanasonad.txt', 'utf8', (err, data) => {
    if (err) {
      res.render("genericlist", {heading: "Valik Eesti tuntud vanasõnasid", listData: ["Kahjuks ei õnnestunud vanasõnu leida"]})
    } else {
      const splitter = data.split(';')
      const vanasonaList = splitter.map(item => item.trim())
      res.render('genericlist', { heading: "Valik Eesti tuntud vanasõnasid", listData: vanasonaList})
    }
  })
})

app.use('/eestifilm', eestifilmRoutes)
app.use('/regvisit', visitRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
