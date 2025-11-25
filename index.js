const express = require('express')
const fs = require('fs')

const app = express()
const port = 5221

const dateEt = require('./src/dateTimeET')

const visitRoutes = require('./routes/visitRoutes')
const eestifilmRoutes = require('./routes/eestifilmRoutes')
const galleryPhotoUploadRoutes = require('./routes/galleryPhotoUploadRoutes')
const indexRoutes = require('./routes/indexRoutes')
const photogalleryRouter = require("./routes/photogalleryRoutes");
const newsRoutes = require("./routes/newsRoutes");
const signUpRoutes = require("./routes/signUpRoutes");
const signInRoutes = require("./routes/signInRoutes");

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/', indexRoutes)

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

app.use("/visits", visitRoutes);
app.get("/regvisit", (req, res) => res.redirect("/visits/"));
app.get("/regvisitlog", (req, res) => res.redirect("/visits/log"));

app.use("/galleryphotoupload", galleryPhotoUploadRoutes)

app.use("/photogallery", photogalleryRouter);

app.use("/news", newsRoutes);

app.use("/signup", signUpRoutes);

app.use("/signin", signInRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
