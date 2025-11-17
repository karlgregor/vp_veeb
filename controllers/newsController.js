const mysql = require('mysql2/promise')
const dbInfo = require('../dbInfo')

//loon andmebaasiühenduse
const dbConfig = {
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
};

const newsHome = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        const now = new Date();

        let sqlReq = "SELECT * FROM news WHERE expire > ?";
        const [rows] = await conn.execute(sqlReq, [now]);

        res.render("news", { newsList: rows });
    } catch (err) {
        console.log(err);
        res.render("news", { newsList: [] });
    } finally {
        if (conn) await conn.end();
    }
};


const newsAddPage = async (req, res) => {
    res.render("news_add");
}

const newsAddPagePost = async (req, res) => {
    let conn;
    let sqlReq = "INSERT INTO news (title, content, expire, userid) VALUES (?,?,?,?)";
    try {
        conn = await mysql.createConnection(dbConfig);

        const userid = 1;

        const [result] = await conn.execute(sqlReq, [req.body.title, req.body.content, req.body.expire, userid]);

        console.log("Result ID: " + result.insertId + " salvestatud!");
        res.render("news_add", { notice: "Uudis on lisatud!" });
    } catch (err) {
        console.log(err);
        res.render("news_add", { notice: "Tekkis tehniline viga:" + err });
    } finally {
        if (conn) await conn.end();
    }
}

module.exports = {newsHome, newsAddPage, newsAddPagePost};