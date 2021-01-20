var  BradescoCartoesMobile =  BradescoCartoesMobile || {};

BradescoCartoesMobile.cache = BradescoCartoesMobile.cache || {};

BradescoCartoesMobile.cache.set = function(key, value) {
	AWBE.localStorage.setItem(key, value);
};

BradescoCartoesMobile.cache.get = function(key) {
	return AWBE.localStorage.getItem(key);
};

BradescoCartoesMobile.cache.setObject = function(key, value) {
	AWBE.localStorage.setItem(key, JSON.stringify(value));
};

BradescoCartoesMobile.cache.getObject = function(key) {
	return $.parseJSON(AWBE.localStorage.getItem(key));
};
