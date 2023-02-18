const config = require("./server/config.json");
var api = require("./server/api");

const express = require("express");

const cors = require("cors");
const app = express();
app.use(cors());

const multer = require("multer");
const upload = multer();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set("etag", false);

app.use((req, res, next) => {
	res.set("Cache-Control", "no-store");
	next();
});

const port = 3000;

const mysql2 = require("mysql2/promise");

app.listen(port, () => {
	console.log(`motherlandglobal Server listening on the port::${port}`);
});

async function getConnection() {
	return mysql2.createConnection({
		host: config.mysql_host,
		user: config.mysql_user,
		password: config.mysql_pass,
		database: config.mysql_db,
		multipleStatements: true,
	});
}

function getAuth(req, res) {
	if (req.body.api_key) {
		if (req.body.api_key == config.api_key) {
			return true;
		} else {
			res.send({
				api_key: req.headers.api_key,
				error: "api_key authentication failed",
			});
			return false;
		}
	} else {
		res.send({ error: "api_key undefined" });
		return false;
	}
}

//----------------------------API Calls-------------------------------------------

app.get("/", (req, res) => {
	res.send("motherlandglobal Server Works !!!!");
});

app.get("/api/getUsers", async (req, res) => {
	let connection = await getConnection();
	connection.connect();

	api.getUsers(connection, req, res).catch(console.log);
});

app.post("/api/getUser", (req, res) => {
	const user = req.body.user;
	users.push(user);
	res.json("user addedd");
});

app.get("/api/getLocations", async (req, res) => {
	let connection = await getConnection();
	connection.connect();

	api.getLocations(connection, req, res).catch(console.log);
});

app.post("/api/getVideos", async (req, res) => {
	let connection = await getConnection();
	connection.connect();

	api.getVideos(connection, req, res).catch(console.log);
});

app.post("/api/signup", upload.none(), async (req, res) => {
	let connection = await getConnection();
	connection.connect();

	api.signup(connection, req, res).catch(console.log);
});

app.post("/function_name", cors(), async (req, res) => {
	if (getAuth(req, res)) {
		// connect to the client db
		let connection = await getConnection();
		connection.connect();

		api.function_name(connection, req, res).catch(console.log);
	}
});
