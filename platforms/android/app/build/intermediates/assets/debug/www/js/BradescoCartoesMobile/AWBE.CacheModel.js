AWBE = AWBE || {};

AWBE.CacheModel = {
	enabled: true,
	limiteCartao: {
		keys: ['contaCartao', 'cartao'],
		ttl: 1800000
	},
	extratoCartao: {
		keys: ['contaCartao', 'cartao', 'dataVencimento', 'tipo'],
		ttl: 1800000
	},
	statusFuncionalidades: {
		keys: ['codigoCanal', 'codigoPerfilCliente', 'codigoPerfilCartao', 'codigoPerfilPlataforma'],
		ttl: 1800000
	},
	clearCache: {
		ttl: 1800000
	}
};
