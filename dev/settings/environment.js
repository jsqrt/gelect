const path = require('path');
const portFinderSync = require('portfinder-sync');
const servPort = portFinderSync.getPort(8080);


module.exports = {
	paths: {
		/* Path to source files directory */
		source: path.resolve(__dirname, '../src/'),

		/* Path to built files directory */
		output: path.resolve(__dirname, '../dist/'),
		build: path.resolve(__dirname, '../build/'),

		/* Path to built files to wp directory */
		wpOutput: path.resolve(__dirname, '../wp_files/wp-content/themes/mytheme/'),
	},
	server: {
		host: '0.0.0.0',
		open: `http://localhost:${servPort}`,
		port: servPort,
	},
	limits: {
		/* Image files size in bytes. Below this value the image file will be served as DataURL (inline base64). */
		images: 8192,

		/* Font files size in bytes. Below this value the font file will be served as DataURL (inline base64). */
		fonts: 8192,
	},
};
