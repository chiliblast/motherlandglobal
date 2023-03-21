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
			res.send("function_name: No result");
			console.log("function_name: No result");
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
			res.send("getUsers: No result");
			console.log("getUsers: No result");
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
			res.send("getLocations: No result");
			console.log("getLocations: No result");
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
				res.send("getVideos: No result");
			}
		} else {
			return 0;
		}
	},

	signin: async function (connection, req, res) {
		let email = req.body.email;
		let password = req.body.password;

		if (this.isValid(email) && this.isValid(password)) {
			let query = `CALL sp_signin('${email}', '${password}')`;

			try {
				let result = await connection.query(query);

				if (result && result[0][0].length > 0) {
					res.send({
						status: "success",
						message: "Sign in successfully",
						body: result[0][0][0],
					});
				} else {
					res.send({
						status: "fail",
						message: "User not registered",
					});
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

			let query = `CALL sp_signup('${firstName}', '${lastName}', '${email}', '${password}')`;

			try {
				let result = await connection.query(query);
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

	getFavourites: async function (connection, req, res) {
		let user_id = req.body.user_id;

		if (this.isValid(user_id)) {
			let query = `
			SELECT id, video_id
			FROM favourites
			WHERE user_id = ?
		  `;
			let [rows] = await connection.query(query, [user_id]);

			if (rows.length) {
				res.send(rows);
			} else {
				res.send([]);
			}
		} else {
			return 0;
		}
	},

	addRemoveFavourite: async function (connection, req, res) {
		let user_id = req.body.user_id;
		let video_id = req.body.video_id;

		if (this.isValid(user_id) && this.isValid(video_id)) {
			try {
				const [rows] = await connection.query(
					"CALL sp_addRemoveFavourite(?, ?, @p_result)",
					[user_id, video_id]
				);
				const [[{ p_result }]] = await connection.query(
					"SELECT @p_result AS p_result"
				);

				if (p_result === "added") {
					res.status(200).json({
						status: "success",
						message: "Added to favourites",
					});
				} else if (p_result === "removed") {
					res.status(200).json({
						status: "success",
						message: "Removed from favourites",
					});
				} else {
					res.status(400).json({
						status: "fail",
						message: "Something went wrong",
					});
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
