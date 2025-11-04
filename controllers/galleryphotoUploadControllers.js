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
    let sqlReq = "INSERT INTO photogallery (id, filename, origname, privacy, alttext, userid, added, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    console.log(req.body);
    console.log(req.file);
    try {
        const fileName = "vp_" + Date.now() + "_" + req.file.originalname + ".jpg";
        console.log(fileName);
        await fs.rename(req.file.path, req.file.destination + fileName);
        await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 80}).toFile("./public/gallery/normal/" + fileName);
        await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 80}).toFile("./public/gallery/thumbs/" + fileName);
        await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.privacyInput, req.body.altInput, 1, new Date(), 0]);
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