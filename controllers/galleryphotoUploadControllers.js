const mysql = require('mysql2/promise')
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
    res.render("galleryupload");
}

module.exports = {
    galleryphotoUploadPage,
    galleryphotoUploadPagePost
}