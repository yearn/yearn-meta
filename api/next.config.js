module.exports = ({
	async redirects() {
		return [
			{source: '/api/protocols/:chainID/all', destination: '/api/:chainID/protocols/', permanent: true},
			{source: '/api/protocols/:chainID/:name', destination: '/api/:chainID/protocols/:name', permanent: true},

			{source: '/api/strategies/:chainID/all', destination: '/api/:chainID/strategies/all', permanent: true},
			{source: '/api/strategies/:chainID/:name', destination: '/api/:chainID/strategies/:name', permanent: true},

			{source: '/api/tokens/:chainID/all', destination: '/api/:chainID/tokens/all', permanent: true},
			{source: '/api/tokens/:chainID/:address', destination: '/api/:chainID/tokens/:address', permanent: true},

			{source: '/api/vaults/:chainID/all', destination: '/api/:chainID/vaults/all', permanent: true},
			{source: '/api/vaults/:chainID/:address', destination: '/api/:chainID/vaults/:address', permanent: true},
		]
	},
});
