//const crypto = require("crypto");

module.exports = {
	function_name: async function (connection, req, res) {
		let clientId = req.body.clientId;
		let query;

		if (this.isValid(clientId)) {
			query = `
                SELECT *
                FROM users
                WHERE id = ${clientId}
            `;
		} else {
			query = `
                SELECT *
                FROM users
            `;
		}

		let result = await connection.query(query);

		await connection.end();

		if (result.length && typeof result[0][0] !== "undefined") {
			//result[0].push({ body: req.body });
			res.send(result[0]);
		} else {
			res.send("No result");
			console.log("No result");
		}

		return 0;
	},

	getUsers: async function (connection, req, res) {
		query = `
                SELECT *
                FROM users
            `;

		let result = await connection.query(query);

		await connection.end();

		if (result.length && typeof result[0][0] !== "undefined") {
			res.send(result[0]);
		} else {
			res.send("No result");
			console.log("No result");
		}

		return 0;
	},

	getLocations: async function (connection, req, res) {
		query = `
                SELECT *
                FROM locations
            `;

		let result = await connection.query(query);

		await connection.end();

		if (result.length && typeof result[0][0] !== "undefined") {
			res.send(result[0]);
		} else {
			res.send("No result");
			console.log("No result");
		}

		return 0;
	},

	getVideos: async function (connection, req, res) {
		let location_id = req.body.location_id;

		if (this.isValid(location_id)) {
			let query = `
                SELECT *
                FROM videos
                WHERE location_id = ${location_id}
            `;
			let result = await connection.query(query);

			await connection.end();

			if (result.length && typeof result[0][0] !== "undefined") {
				res.send(result[0]);
			} else {
				res.send("No result");
				console.log("No result");
			}
		} else {
			return 0;
		}
	},

	signup: async function (connection, req, res) {
		let firstName = req.body.firstName;
		let lastName = req.body.lastName;
		let email = req.body.email;
		let password = req.body.password;

		if (
			this.isValid(firstName) &&
			this.isValid(lastName) &&
			this.isValid(email) &&
			this.isValid(password)
		) {
			/*const hash = crypto.createHash("md5").update(password).digest("hex");

			let query = `INSERT INTO users (firstName, lastName, email, password)
  				VALUES ('${firstName}', '${lastName}', '${email}', '${hash}');`;*/

			let query = `CALL insert_user('${firstName}', '${lastName}', '${email}', '${password}')`;

			try {
				let result = await connection.query(query);
				console.log(result[0]);
				if (result && result[0].affectedRows === 1) {
					res.send({
						status: "success",
						message: "User registered successfully",
						body: result[0],
					});
				} else {
					res.send({
						status: "fail",
						message: "User already registered",
					});
					console.log("No result");
				}
			} catch (err) {
				console.error(err);
				return 0;
			} finally {
				await connection.end();
			}
		} else {
			return 0;
		}
	},

	isValid: function (val) {
		if (val != undefined && val != null && val != "") {
			return true;
		} else {
			return false;
		}
	},
};
