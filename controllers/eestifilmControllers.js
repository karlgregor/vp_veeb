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
    let sqlReq = "INSERT INTO position (position_name, description) VALUES (?,?)";
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

const filmPosition = async (req, res) => {
    let conn;
    let sqlReq = "SELECT * FROM position";
    try {
        conn = await mysql.createConnection(dbInfo);
        console.log("DB connection established")
        const [rows] = await conn.execute(sqlReq);
        res.render("filmiametid", {positionList: rows});
    } catch (err) {
        console.log(err);
        res.render("filmiametid", {positionList: []});
    } finally {
        if (conn) conn.end();
    }
};

const filmPositionAddPost = async (req, res)=>{
  let conn;
  let sqlReq = "INSERT INTO position (position_name, description) VALUES (?, ?)";
  try {
      if(!req.body.positionNameInput){
          res.render("filmiametid_add", {notice: "Palun kirjuta ameti nimetus!"});
          return;
      }
      conn = await mysql.createConnection(dbInfo);
      console.log("DB connection established");
      const [result] = await conn.execute(sqlReq, [req.body.positionNameInput, req.body.positionDescriptionInput || null]);
      await conn.end();
      res.redirect("/eestifilm/ametid");
  } catch(err) {
      console.log(err);
      if(conn) await conn.end();
      res.render("filmiametid_add", {notice: "Tekkis tehniline viga:" + err});
  }
};

const filmAddPage = (req, res)=>{
  res.render("film_add", {notice: "Ootan sisestust!"});
};

const filmAddPagePost = async (req, res)=>{
  let conn;
  let sqlReq = "INSERT INTO movie (title, year, description) VALUES (?, ?, ?)";
  try{
      if(!req.body.titleInput){
          res.render("filmi_add", {notice: "Palun sisesta filmi pealkiri!"});
          return;
      }
      conn = await mysql.createConnection(dbInfo);
      console.log("DB connection established");
      await conn.execute(sqlReq, [req.body.titleInput, req.body.yearInput || null, req.body.descriptionInput || null]);
      await conn.end();
      res.redirect("/eestifilm");
  }
  catch(err){
      console.log(err);
      if(conn) await conn.end();
      res.render("filmi_add", {notice: "Tekkis tehniline viga:" + err});
  }
};

const seosAddPage = async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbInfo);
    const [people] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name");
    const [films] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
    const [positions] = await conn.execute("SELECT id, position_name FROM position ORDER BY position_name");
    await conn.end();
    res.render("seos_add", { people: people, films: films, positions: positions, notice: "" });
  } catch (err) {
    console.log(err);
    if (conn) await conn.end();
    res.render("seos_add", { people: [], films: [], positions: [], notice: "Tekkis tehniline viga:" + err });
  }
};

const seosAddPagePost = async (req, res) => {
  let conn;
  try {
    const personId = req.body.personSelect;
    const filmId = req.body.filmSelect;
    const positionId = req.body.positionSelect;
    const role = req.body.roleInput || null;

    if (!(personId && filmId && positionId)) {
      conn = await mysql.createConnection(dbInfo);
      const [people] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name");
      const [films] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
      const [positions] = await conn.execute("SELECT id, position_name FROM position ORDER BY position_name");
      await conn.end();
      res.render("seos_add", { people, films, positions, notice: "Palun vali isik, film ja amet." });
      return;
    }

    conn = await mysql.createConnection(dbInfo);
    const sql = "INSERT INTO person_film_position (person_id, film_id, position_id, role) VALUES (?, ?, ?, ?)";
    await conn.execute(sql, [personId, filmId, positionId, role]);
    await conn.end();
    res.redirect("/eestifilm/seosed");
  } catch (err) {
    console.log(err);
    if (conn) await conn.end();
    res.render("seos_add", { people: [], films: [], positions: [], notice: "Tekkis tehniline viga:" + err });
  }
};

const seosedList = async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbInfo);
    const sql = "SELECT p.id AS person_id, p.first_name, p.last_name, f.title AS movie_title, pos.position_name, rel.role FROM person_film_position rel JOIN person p ON p.id = rel.person_id JOIN movie f ON f.id = rel.movie_id JOIN position pos ON pos.id = rel.position_id ORDER BY p.last_name, p.first_name, f.title";
    const [rows] = await conn.execute(sql);
    await conn.end();
    res.render("seosed", { relations: rows });
  } catch (err) {
    console.log(err);
    if (conn) await conn.end();
    res.render("seosed", { relations: [], notice: "Tekkis tehniline viga:" + err });
  }
};

module.exports = {
    filmHomePage,
    filmPeoplePage,
    filmPeopleAddPage,
    filmPeopleAddPost,
    filmJobsPage,
    filmJobsAddPage,
    filmJobsAddPost,
    filmPosition,
    filmPositionAddPost,
    filmAddPage,
    filmAddPagePost,
    seosAddPage,
    seosAddPagePost,
    seosedList
}