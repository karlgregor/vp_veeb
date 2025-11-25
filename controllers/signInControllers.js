const mysql = require('mysql2/promise')
const dbInfo = require('../dbInfo')
const argon2 = require('argon2');

//loon andmebaasiühenduse
const dbConfig = {
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
};

const signInPage = (req, res) => {
	res.render("signin", {notice: "Ootan andmeid ..."});
};

const signInPagePost = async (req, res) => {
	let conn;
  
	// Validate input
	if (
	  !req.body.emailInput ||
	  !req.body.passwordInput
	) {
	  return res.render("signin", { notice: "Puuduvad andmed!" });
	}
  
	try {
	  conn = await mysql.createConnection(dbConfig);
  
	  const sql = "SELECT * FROM users_id WHERE email = ?";
	  const [rows] = await conn.execute(sql, [req.body.emailInput]);
  
	  if (rows.length === 0) {
		return res.render("signin", { notice: "Vale e-mail või parool!" });
	  }
  
	  const user = rows[0];
  
	  const match = await argon2.verify(user.password, req.body.passwordInput);
  
	  if (!match) {
		return res.render("signin", { notice: "Vale e-mail või parool!" });
	  }
  
	  console.log("Login OK:", user.email);
	  res.render("signin", { notice: "Sisselogimine õnnestus!" });
  
	} catch (err) {
	  console.log(err);
	  res.render("signin", { notice: "Tekkis tehniline viga" });
	} finally {
	  if (conn) await conn.end();
	}
};

module.exports = {
	signInPage,
	signInPagePost
};