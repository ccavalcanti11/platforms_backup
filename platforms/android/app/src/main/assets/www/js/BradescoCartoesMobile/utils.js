var BradescoCartoesMobile = BradescoCartoesMobile || {};

BradescoCartoesMobile.utils = BradescoCartoesMobile.utils || {};

//para os permitir os carascteres - (spaço),[A-Z],[a-z],(letras acentuadas)
//usado em "cartões adicionais"
BradescoCartoesMobile.utils.naoAlfanumerico1 = function (ascII){
	
	if ((ascII == 32) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
    else if (Number.isNaN(ascII)) return false;
    else return true;
}

//para os permitir os carascteres - (spaço),[A-Z],[a-z],"'",[0,9],(letras acentuadas)  
//usado em "alteração endereço bloqueio" e "components"
BradescoCartoesMobile.utils.naoAlfanumerico2 = function (ascII){
	
	if ((ascII == 39) || (ascII == 32) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
    else if (Number.isNaN(ascII)) return false;
    else return true;
}

//para os permitir os carascteres - (spaço),[A-Z],[a-z],"'",",",".","-","/",[0,9],(letras acentuadas)  
//usado em "codigo ativacao email","enviar codigo ativacao sms" e "adicionar cartoes"
BradescoCartoesMobile.utils.naoAlfanumerico3 = function (ascII){
	
	if ((ascII == 32) || (ascII == 39) || (ascII >= 44 && ascII <=46) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
	else if (Number.isNaN(ascII)) return false;
	else return true;
}

//para os permitir os carascteres - (spaço),[A-Z],[a-z],"'","!","$","%"?"@",[0,9],(letras acentuadas)  
//usado em "contestação"
BradescoCartoesMobile.utils.naoAlfanumerico4 = function (ascII){
	
	if ((ascII == 39) || (ascII == 32) || (ascII == 33) || (ascII == 36) || (ascII == 37) || (ascII >= 48 && ascII <= 57) || (ascII >= 63 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
	else if (Number.isNaN(ascII)) return false;
	else return true;
}

//para os permitir os carascteres - (spaço),[A-Z],[a-z],[0,9],(letras acentuadas)  
//usado em "meus cartões"
BradescoCartoesMobile.utils.naoAlfanumerico5 = function (ascII){
	
	if ((ascII == 32) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122) || (ascII >= 192 && ascII <= 255)) return false;
	else if (Number.isNaN(ascII)) return false;
	else return true;
}

//para os permitir os carascteres - @,[A-Z],[a-z],".","-",[0,9]
//usado em "email - finalizar cadastro"
BradescoCartoesMobile.utils.naoAlfanumerico6 = function (ascII){
	
	if ((ascII == 64) || (ascII >= 45 && ascII <=46) || (ascII >= 48 && ascII <= 57) || (ascII >= 65 && ascII <= 90) || (ascII >= 97 && ascII <= 122)) return false;
	else if (Number.isNaN(ascII)) return false;
	else return true;
}

//recupera o código ascci do ultimo caractere
BradescoCartoesMobile.utils.getAscii = function (){
	
    return document.activeElement.value.substr(document.activeElement.value.length-1).charCodeAt(0);
}

//remove qualquer numero de caracteres indicados pelo parametro "quantos"
BradescoCartoesMobile.utils.removeChar = function (quantos){
	
	document.activeElement.value = document.activeElement.value.substring(0, document.activeElement.value.length - quantos);
}

BradescoCartoesMobile.utils.isCPF = function (cpf) {
    // retira pontos e tracos
    cpf = cpf.toString().trim().replace(/[^\d]+/g,'');
    
    if(cpf == '') return false; 
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;       
    // Valida 1o digito 
    add = 0;    
    for (i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;       
    // Valida 2o digito 
    add = 0;    
    for (i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10))) {
        return false;
    }
    return true;   
}