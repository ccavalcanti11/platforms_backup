cordova.define("scopus-cordova-pinning.ScopusPinningCDV", function(require, exports, module) { /**
 * @author Scopus -> Segurança de Sistemas
 */

function ScopusPinningCDV() {}

/**
 *  Valida o certificado de um determinado host utlizando o hash da subjectPublicKeyInfo deste certificado, bem como
 *  a validação de cadeia utilizando os certificados do host.
 *
 *  @param success                 	Callback de sucesso
 *  @param fail     				Callback de erro
 *  @param host     				O endereço URL a ser validado
 *  @param certificateHashes     	Um vetor com os hashes que serão usados na validação da URL.
 *  @param certificateFileNames     O caminho para os certificados do host.
 */
ScopusPinningCDV.prototype.evaluate = function (success, fail, host, certificateHashes, certificateFileNames) {
    cordova.exec(success, fail, "ScopusPinningCDV", "evaluate", [host, certificateHashes, certificateFileNames]);
};

module.exports = new ScopusPinningCDV();
});
