const fs = require('fs')
const path = require('path')
const dateEt = require('../src/dateTimeET')

const visitLogFile = path.join(__dirname, '../public/txt/reqvisit.txt')

const visitRegisterPage = (req, res) => {
    res.render("regvisit");
}

const visitRegisterPagePost = (req, res) => {
    const line = `${req.body.firstNameInput || ""} ${req.body.lastNameInput || ""}, ${dateEt.longDate()} kell ${dateEt.time()};`;
    fs.open(visitLogFile, "a", (err) => {
      if (err) return res.status(500).send("Faili avamisel viga");
      fs.appendFile(visitLogFile, line, (err) => {
        if (err) return res.status(500).send("Faili kirjutamisel viga");
        res.redirect("/regvisit");
      });
    });
};

const visitLogPage = (req, res) => {
    fs.readFile(visitLogFile, "utf8", (err, data) => {
      if (err) {
        return res.render("regvisit", { regvisitList: ["Ei leidnud ühtegi külastust!"] });
      }
      const items = data.split(";").filter(Boolean);
      res.render("regvisit", { regvisitList: items });
    });
};
  
module.exports = { visitRegisterPage, visitRegisterPagePost, visitLogPage };