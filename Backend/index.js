const express = require('express');
const cors = require('cors');
const mysql = require("mysql");
const util = require('util')


const app = express();

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "employee_system",
});

db.connect((err) => {
  if (err) console.log(err)
  else {
    console.log('Conncted to DB')
  }
})
const query = util.promisify(db.query).bind(db)

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

app.get("/employees", async (req, res) => {
  try {
    const result = await query("SELECT * FROM employees");
    res.send(result);
  } catch (error) {
    console.log(error)
  }


  // db.query("SELECT * FROM employees", (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.send(result);
  //   }
  // });
});

// Create a new Employee
app.post('/create', async (req, res) => {

  const { name, age, country, position, wage } = req.body
  try {
    const result = await query(
      "INSERT INTO employees (name, age, country, position, wage) VALUES (?,?,?,?,?)",
      [name, age, country, position, wage]);
    res.send("Values Inserted");
  } catch (error) {
    console.log(`there was an error ${error}`);
  }

  // db.query(
  //   "INSERT INTO employees (name, age, country, position, wage) VALUES (?,?,?,?,?)",
  //   [name, age, country, position, wage],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send("Values Inserted");
  //     }
  //   }
  // );

})

// Update Employee Wage

app.put("/update", async (req, res) => {
  const { id, wage } = req.body
  try {
    const result = await query("UPDATE employees SET wage = ? WHERE id = ?", [wage, id]);
    res.send(result)
  } catch (error) {
    console.log(`there was an error ${error}`);
  }

  // db.query(
  //   "UPDATE employees SET wage = ? WHERE id = ?",
  //   [wage, id],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send(result);
  //     }
  //   }
  // );
});


app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query("DELETE FROM employees WHERE id = ?", id);
    res.send(result);

  } catch (error) {
    console.log(`there was an error ${error}`);
  }

  // db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.send(result);
  //   }
  // });
});
app.listen(5001, () => {
  console.log('server started on port 5000')
})
