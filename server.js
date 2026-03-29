const { pool } = require("./config/db");
const express = require('express');
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));    // for req.body POST forms
app.use(express.static(path.join(__dirname, "public")));    // set dir for static files
app.use(express.json());    // for working with json

// Routing
app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.get('/booking', (req, res) => {
    res.render('booking.ejs')
})
app.get('/api/booking', async (req, res) => {
    try {
      const [rows] = await pool.execute("SELECT id, date, time FROM appointments WHERE date >= CURDATE()");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Chyba databázy" });
    }
  });
app.post("/booking", async (req, res) => {
    try {
        await pool.query(
            "INSERT INTO appointments (date, time, name, surname, phone, email) VALUES (?, ?, ?, ?, ?, ?)",
            [req.body.day, req.body.time, req.body.name, req.body.surname, req.body.tel, req.body.email]
        );
        res.redirect("/success");
    } catch (err) {
        res.status(500).send("DB error");
    };
});

app.get("/success", (req, res) => {
    res.render('success.ejs')
})

app.listen(5000, () => {console.log(__dirname)})