module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,html}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/,
		/^n/
	]
};