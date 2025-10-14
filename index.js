const express = require('express')
const app = express()
const port = 5221

const mysql = require('mysql2/promise')
const dbInfo = require('./dbInfo')

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
});

const dateEt = require('./src/dateTimeET')
const fs = require('fs')

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

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

app.get('/reqvisit', (req, res) => {
  fs.readFile('public/txt/reqvisit.txt', 'utf8', (err, data) => {
    if (err) {
      // File doesn't exist or error reading, render with empty list
      res.render('reqvisit', { reqvisitList: [] })
    } else {
      const splitter = data.split('\n')
      const reqvisitList = splitter.map(item => item.trim()).filter(item => item.length > 0)
      res.render('reqvisit', { reqvisitList })
    }
  })
})

app.post('/reqvisit', (req, res) => {
  const { name, message } = req.body
  
  // Simple validation
  if (!name || !message) {
    // Read existing data to show on error
    fs.readFile('public/txt/reqvisit.txt', 'utf8', (err, data) => {
      if (err) {
        return res.render('reqvisit', { 
          error: 'Palun täida kõik väljad',
          name: name || '',
          message: message || '',
          reqvisitList: []
        })
      } else {
        const splitter = data.split('\n')
        const reqvisitList = splitter.map(item => item.trim()).filter(item => item.length > 0)
        return res.render('reqvisit', { 
          error: 'Palun täida kõik väljad',
          name: name || '',
          message: message || '',
          reqvisitList
        })
      }
    })
    return
  }
  
  // Here you could save to database, send email, etc.
  fs.appendFile('public/txt/reqvisit.txt', `${name}: ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to file:', err)
      return res.render('reqvisit', { 
        error: 'Viga faili kirjutamisel',
        name: name || '',
        message: message || '',
        reqvisitList: []
      })
    }
    
    // Read the updated file and render with success message
    fs.readFile('public/txt/reqvisit.txt', 'utf8', (readErr, data) => {
      if (readErr) {
        res.render('reqvisit', { 
          success: 'Täname! Teie külastuse taotlus on saadetud.',
          name: '',
          message: '',
          reqvisitList: []
        })
      } else {
        const splitter = data.split('\n')
        const reqvisitList = splitter.map(item => item.trim()).filter(item => item.length > 0)
        res.render('reqvisit', { 
          success: 'Täname! Teie külastuse taotlus on saadetud.',
          name: '',
          message: '',
          reqvisitList
        })
      }
    })
  })
})

app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

/* app.get("/eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("filmiinimesed", {personList: []});
		}
		else {
			console.log(sqlRes);
			res.render("filmiinimesed", {personList: sqlRes});
		}
		
	});
	//res.render("filmiinimesed");
}); */

app.get("/eestifilm/inimesed", async (req, res)=>{
  let conn;
  const sqlReq = "SELECT * FROM person";
  try {
    conn = await mysql.createConnection(dbInfo);
    console.log("DB connection established")
    const [rows, fields] = await conn.execute(sqlReq);
    res.render("filmiinimesed", {personList: rows})
  } catch (err) {
    console.log(err);
    res.render("filmiinimesed", {personList: []});
  } finally {
    if (conn) conn.end();
  }
});

app.get("/eestifilm/inimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
});

app.post("/eestifilm/inimesed_add", async (req, res)=>{
	let conn;
  let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";

	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!"});
    return;
	} else {
    try {
      conn = await mysql.createConnection(dbInfo);
      console.log("DB connection established")
      let deceasedDate = null;
      if(req.body.deceasedInput != ""){
        deceasedDate = req.body.deceasedInput;
      }
      const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
      console.log("Result ID: " + result.insertId + " salvestatud!");
      res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
    } catch (err) {
      console.log(err);
      res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga:" + err});
    } finally {
      if (conn) conn.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
