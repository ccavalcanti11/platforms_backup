var cpf =  AWBE.sessionStorage.getItem('user').cpf;
if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
	//CHAMADA PARA A MAQUINA DE ESTADOS
	setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
			cpf, 												        					//CPF
			BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
			BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
			false,																			//IDENTIFICADOR LEGADO
			BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_EMAIL_SMS,			//CODIGO ETAPA
			BradescoCartoesMobile.components.resultadoMaquinaEstado.PENDENTE				//RESULTADO PROCESSAMENTO 
	),400);
	//FIM CHAMADA PARA A MAQUINA DE ESTADOS
}

$('#opcaoSMS').on('click', function(views, params, model) {

	BradescoCartoesMobile.components.popularAppsFlyerGa('VERIFESQMINHASENHASMS');

	if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
				cpf, 												        					//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
				BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
				false,																			//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_EMAIL_SMS,			//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_SMS				//RESULTADO PROCESSAMENTO 
		),500);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	}
    window.location.href = '#enviarCodigoAtivacaoSMSEsqueciMinhaSenha';
});

$('#opcaoEmail').on('click', function(views, params, model) {

	BradescoCartoesMobile.components.popularAppsFlyerGa('VERIFESQMINHASENHAEMAIL');
	
	if(AWBE.localStorage.getItem('bloqueioVirtual_'+cpf)==="true"){
		//CHAMADA PARA A MAQUINA DE ESTADOS
		setTimeout(BradescoCartoesMobile.components.atualizaMaquinaEstado(
				cpf, 												        					//CPF
				BradescoCartoesMobile.components.passoMaquinaEstado.PERFIL_COMPLETO,			//PASSO
				BradescoCartoesMobile.components.tipoCadastro.BLOQUEIO_VIRTUAL,					//TIPO CADASTRO
				false,																			//IDENTIFICADOR LEGADO
				BradescoCartoesMobile.components.etapaMaquinaEstado.OPCAO_EMAIL_SMS,			//CODIGO ETAPA
				BradescoCartoesMobile.components.resultadoMaquinaEstado.OPCAO_EMAIL				//RESULTADO PROCESSAMENTO 
		),500);
		//FIM CHAMADA PARA A MAQUINA DE ESTADOS
	}
    window.location.href = '#enviarCodigoAtivacaoEmailEsqueciMinhaSenha';
});