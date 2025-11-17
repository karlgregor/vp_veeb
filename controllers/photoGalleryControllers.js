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


module.exports = {photogalleryHome};