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

const galleryphotoUploadPage = (req, res) => {
    res.render("galleryupload");
}

const galleryphotoUploadPagePost = async (req, res)=>{
    let conn;
    console.log(req.body);
    console.log(req.file);

    try {
        const fileName = "vp_" + Date.now() + ".jpg";
        console.log(fileName);

        await fs.rename(req.file.path, req.file.destination + fileName);

        await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 80}).toFile("./public/gallery/normal/" + fileName);
        await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 80}).toFile("./public/gallery/thumbs/" + fileName);

        let sqlReq = "INSERT INTO galleryphotos_id (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";

        const userid = 1;

        conn = await mysql.createConnection(dbInfo);
        console.log("DB connection established");

        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userid])

        console.log("Result ID: " + result.insertId + " salvestatud!");
        res.render("galleryupload", {notice: "Andmed on salvestatud!"});
    } catch(err) {
        console.log(err);
        res.render("galleryupload", {notice: "Tekkis tehniline viga:" + err});
    } finally {
        if (conn) await conn.end();
    }
}

module.exports = {
    galleryphotoUploadPage,
    galleryphotoUploadPagePost
}
