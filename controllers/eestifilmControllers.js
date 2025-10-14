const mysql = require('mysql2/promise')
const dbInfo = require('../dbInfo')

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
});

//@desc Home page for Estonian film section
//@route GET /eestifilm
//@access Public

const filmHomePage = async (req, res) => {
    res.render("eestifilm");
}

//@desc Home page for Estonian film section
//@route GET /eestifilm/inimesed
//@access Public

const filmPeoplePage = async (req, res) => {
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
}

//@desc Home page for Estonian film section
//@route GET /eestifilm/inimesed_add
//@access Public

const filmPeopleAddPage = async (req, res) => {
    res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
}

//@desc Home page for Estonian film section
//@route POST /eestifilm/inimesed_add
//@access Public

const filmPeopleAddPost = async (req, res) => {
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
}

const filmJobsPage = async (req, res) => {
    let conn;
    let sqlReq = "SELECT * FROM position";
    try {
        conn = await mysql.createConnection(dbInfo);
        console.log("DB connection established")
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiametid", {positionList: rows});
    } catch (err) {
        console.log(err);
        res.render("filmiametid", {positionList: []});
    } finally {
        if (conn) conn.end();
    }
}

const filmJobsAddPage = async (req, res) => {
	res.render("filmiametid_add", {notice: "Ootan sisestust!"});
};

const filmJobsAddPost = async (req, res)=>{
    let conn;
    let sqlReq = "INSERT INTO 'position' (position_name, description) VALUES (?,?)";
	console.log(req.body);
	//kas andmed on olemas?
	if (!req.body.positionNameInput){
		res.render("filmiametid_add", {notice: "Palun kirjuta ameti nimetus!"});
        return;
	} else {
		try {
			conn = await mysql.createConnection(dbInfo);
			console.log("DB connection established")
			const [result] = await conn.execute(sqlReq, [req.body.positionNameInput, req.body.positionDescriptionInput]);
			console.log("Result ID: " + result.insertId + " salvestatud!");
			res.render("filmiametid_add", {notice: "Andmed on salvestatud!"});
		} catch (err) {
			console.log(err);
			res.render("filmiametid_add", {notice: "Tekkis tehniline viga:" + err});
		} finally {
			if (conn) conn.end();
		}
	}
};


module.exports = {
    filmHomePage,
    filmPeoplePage,
    filmPeopleAddPage,
    filmPeopleAddPost,
    filmJobsPage,
    filmJobsAddPage,
    filmJobsAddPost
}