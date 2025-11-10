const mysql = require('mysql2/promise')
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require('../dbInfo')

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
});

const indexPage = async (req, res) => {
    let conn;
    let sqlReq = "SELECT * FROM photogallery_id WHERE privacy = 3 ORDER BY id DESC LIMIT 1";
    try {
        conn = await mysql.createConnection(dbInfo);
        const [result] = await conn.execute(sqlReq);
        res.render("index", { photo: result });
    } catch(err) {
        console.log(err);
        res.render("index", { photo: [] });
    } finally {
        if (conn) await conn.end();
    }
};

module.exports = {
    indexPage
}