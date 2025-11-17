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

        let sqlReq = "SELECT * FROM news WHERE expired > ? OR expired IS NULL";
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
    let sqlReq = "INSERT INTO news (title, content, expired, user_id) VALUES (?,?,?,?)";
    try {
        conn = await mysql.createConnection(dbConfig);

        // Get form values - use correct field names from the form
        const title = req.body.titleInput || null;
        const content = req.body.contentInput || null;
        const expireInput = req.body.expireInput || null;
        const user_id = 1;

        // Convert date string to datetime format (YYYY-MM-DD -> YYYY-MM-DD HH:MM:SS)
        let expired = null;
        if (expireInput) {
            // If date is provided, set it to end of day (23:59:59)
            expired = new Date(expireInput + 'T23:59:59');
        }

        // Validate required fields
        if (!title || !content) {
            return res.render("news_add", { notice: "Pealkiri ja sisu on kohustuslikud väljad!" });
        }

        const [result] = await conn.execute(sqlReq, [title, content, expired, user_id]);

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