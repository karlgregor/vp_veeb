const mysql = require('mysql2/promise')
const dbInfo = require('../dbInfo')

//loon andmebaasiühenduse
const dbConfig = {
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
};

const signUpPage = (req, res) => {
	res.render("signup", {notice: "Ootan andmeid ..."});
};

const signUpPagePost = async (req, res) => {
	let conn;
	console.log(req.body);
	if(
	  !req.body.firstNameInput ||
	  !req.body.lastNameInput ||
	  !req.body.birthDateInput ||
	  !req.body.genderInput ||
	  !req.body.emailInput ||
	  req.body.passwordInput.length < 8 ||
	  req.body.passwordInput !== req.body.confirmPasswordInput
	) {
		let notice = "Andmeid on puudu või need on vigased!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
	
	try {
	  const pwdHash = await argon2.hash(req.body.passwordInput);
	  
	  conn = await mysql.createConnection(dbConfig);
	  let sqlReq = "INSERT INTO users_id (first_name, last_name, birth_date, gender, email, password) VALUES(?,?,?,?,?,?)";
	  const [result] = await conn.execute(sqlReq, [
	    req.body.firstNameInput,
	    req.body.lastNameInput,
	    req.body.birthDateInput,
	    req.body.genderInput,
	    req.body.emailInput,
		pwdHash
	  ]);

	  console.log("Salvestati kasutaja id: " + result.insertId);
	  res.render("signup", {notice: "Konto loodud!"});
	}
	catch(err) {
	  console.log(err);
	  res.render("signup", {notice: "Tehniline viga"});
	}
	finally {
	  if(conn){
		await conn.end();
		console.log("Andmebaasiühendus suletud!");
	  }
	}
};


module.exports = {
	signUpPage,
	signUpPagePost
};