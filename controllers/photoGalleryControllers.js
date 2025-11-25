const mysql = require('mysql2/promise')
const dbInfo = require('../dbInfo')

//loon andmebaasiühenduse
const dbConfig = {
	host: dbInfo.host,
	user: dbInfo.user,
	password: dbInfo.password,
	database: dbInfo.database
};

const photogalleryHome = async (req, res)=>{
	let conn;
	try {
	  conn = await mysql.createConnection(dbConfig);
      console.log("DB connection established");
	  let sqlReq = "SELECT filename, alttext FROM photogallery WHERE privacy >= ? AND deleted IS NULL";
	  const privacy = 2;
	  const [rows, fields] = await conn.execute(sqlReq, [privacy]);
	  console.log("Rows: " + rows);
	  let galleryData = [];
	  for (let i = 0; i < rows.length; i++){
		  let altText = "Galeriipilt";
		  if(rows[i].alttext != ""){
			  altText = rows[i].alttext;
		  }
		  galleryData.push({src: rows[i].filename, alt: altText});
	  }
	  res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
	}
	catch(err) {
	  console.log(err);
	  res.render("photogallery", {galleryData: [], imagehref: "/gallery/thumbs/"});
	}
	finally {
	  if(conn){
		await conn.end();
		console.log("DB connection closed!");
	  }
	}
};

const photogalleryPersonalHome = async (req, res)=>{
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log("DB connection established");

        const userid = req.session.userId;

        let sqlReq = "SELECT filename, alttext FROM photogallery WHERE userid = ? AND deleted IS NULL";
        const [rows] = await conn.execute(sqlReq, [userid]);

        console.log(rows);

        let galleryData = rows.map(r => ({
            src: r.filename,
            alt: r.alttext && r.alttext !== "" ? r.alttext : "Galeriipilt"
        }));

        res.render("photogallery", {galleryData, imagehref: "/gallery/thumbs/"});
    }
    catch(err) {
        console.log(err);
        res.render("photogallery", {galleryData: [], imagehref: "/gallery/thumbs/"});
    }
    finally {
        if(conn) await conn.end();
        console.log("DB connection closed!");
    }
};

const photogalleryPersonalPic = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        const userid = req.session.userId;
        const photoId = req.params.id;

        const sqlReq = "SELECT * FROM photogallery WHERE id = ? AND userid = ? AND deleted IS NULL";
        const [rows] = await conn.execute(sqlReq, [photoId, userid]);

        if (rows.length === 0) {
            return res.render("singlephoto", { error: "Pilt ei leitud!", photo: null });
        }

        const photo = rows[0];

        res.render("singlephoto", {
            error: null,
            photo: {
                id: photo.id,
                filename: photo.filename,
                alttext: photo.alttext,
                privacy: photo.privacy
            },
            imagehref: "/gallery/normal/"
        });
    } catch (err) {
        console.log(err);
        res.render("singlephoto", { error: "Tekkis viga", photo: null });
    } finally {
        if (conn) await conn.end();
    }
};

const photogalleryPersonalPicPost = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        const userid = req.session.userId;
        const photoId = req.params.id;
        const { altInput, privacyInput } = req.body;

        const sqlReq = `
            UPDATE photogallery
            SET alttext = ?, privacy = ?
            WHERE id = ? AND userid = ? AND deleted IS NULL
        `;

        const [result] = await conn.execute(sqlReq, [
            altInput,
            privacyInput,
            photoId,
            userid
        ]);

        res.redirect(`/myphotos/${photoId}`);
    } catch (err) {
        console.log(err);
        res.render("singlephoto", { error: "Viga salvestamisel!", photo: null });
    } finally {
        if (conn) await conn.end();
    }
};

module.exports = {
    photogalleryHome,
    photogalleryPersonalHome,
	photogalleryPersonalPic,
	photogalleryPersonalPicPost
};