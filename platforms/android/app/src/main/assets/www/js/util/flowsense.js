var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.flowsense = BradescoCartoesMobile.flowsense || {};

BradescoCartoesMobile.flowsense.init = function() {
    window.sqlitePlugin.openDatabase({ name: 'flowsense', location: 'default' }, function(db) {
        BradescoCartoesMobile.flowsense.db = db;
        BradescoCartoesMobile.flowsense.db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS account (cpf)');
        }, function(error) {
            console.log('Transaction Flowsense DB - CREATE TABLE - ERROR: ' + error.message);
        }, function() {
            console.log('Transaction Flowsense DB - CREATE TABLE - OK');
        });
    });
};

BradescoCartoesMobile.flowsense.insertCPF = function(cpf) {
    if (BradescoCartoesMobile.flowsense.db === undefined)
        try {
            setTimeout(BradescoCartoesMobile.flowsense.insertCPF(cpf),1000)
        }
        catch(e){
           console.log(e.message)
        }
    else
    	if(BradescoCartoesMobile.utils.isCPF(cpf)){
            BradescoCartoesMobile.flowsense.db.transaction(function(tx) {
                tx.executeSql("SELECT cpf FROM account WHERE cpf = ?", [cpf], function (tx, resultSet) {
                    if(resultSet.rows.length == 0) {
                        tx.executeSql('INSERT INTO account VALUES (?)', [cpf]);
                    }
                });
            }, function(error) {
                console.log('Transaction Flowsense DB - INSERT CPF - ERROR: ' + error.message);
            }, function() {
                console.log('Transaction Flowsense DB - INSERT CPF - OK');
            });
        }
};

BradescoCartoesMobile.flowsense.removeCPF = function(cpf) {
	if(BradescoCartoesMobile.utils.isCPF(cpf)){
	    BradescoCartoesMobile.flowsense.db.transaction(function(tx) {
	        tx.executeSql('DELETE FROM account WHERE cpf = ?', [cpf]);
	    }, function(error) {
	        console.log('Transaction Flowsense DB - REMOVE CPF - ERROR: ' + error.message);
	    }, function() {
	        console.log('Transaction Flowsense DB - REMOVE CPF - OK');
	    });
	}
};
