import axios from "axios";
import express from "express";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { engine } from "express-handlebars";
import _ from "lodash";

//uso de express
const app = express();

// ruta-absoluta
const __dirname = import.meta.dirname;

//middleware archivos estaticos
app.use(express.static("public"));
app.use(
  "/assets/css",
  express.static(__dirname + "/node_modules/bootstrap/dist/css")
);

app.use(
  "/assets/js",
  express.static(__dirname + "/node_modules/bootstrap/dist/js")
);
app.use(
  "assets/css",
  express.static(__dirname + "/node_modules/font-awesome/css")
);
app.use(
  "assets/css",
  express.static(__dirname + "/node_modules/font-awesome/fonts")
);
//moment (hora-dia español)
moment.locale("es");

//hbs - handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

const usuarios = [];
let generoDivision = [];

app.get("/pacientes", async (req, res) => {
  try {
    const { data } = await axios.get("https://randomuser.me/api/");
    const newUser = data.results[0];
    const id = uuidv4().slice(0, 3);
    const fecha = moment().format("D MMMM YYYY, hh:mm:ss a");
    const arrayUser = {
      name: newUser.name.first,
      apellido: newUser.name.last,
      id: id,
      fecha: fecha,
      genero: newUser.gender,
    };
    usuarios.push(arrayUser);
    generoDivision = _.partition(usuarios, (item) => item.genero === "male");
    console.log(
      chalk.red.bgYellow.bold(JSON.stringify(generoDivision, null, 2))
    );

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false });
  }
});
app.get("/", (req, res) => {
  try {
    res.render("inicio", { usuarios: generoDivision });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Conexión Establecida ok.."));
