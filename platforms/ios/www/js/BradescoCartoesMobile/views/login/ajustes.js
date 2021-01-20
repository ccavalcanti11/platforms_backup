//TODO: migrar código abaixo
	$('#touchid').on('click', function(e){
			e.preventDefault();
		  var conta = AWBE.sessionStorage.getItem('user');

			if($('#touchid').is(":checked")) {
					AWBE.Components.TouchID.autenticarWithFallback(
	                              'Você pode usar sua digital para acessar a conta. Para isso, toque agora no sensor.\nIMPORTANTE: Todas as digitais cadastradas no seu iPhone terão acesso à conta.', // this will be shown in the native scanner popup
	                              '',
	                              function() {
																  AWBE.Components.Keychain.set(conta.cpf, AWBE.sessionStorage.getItem('pass'),
																          function() {
																            //salvou senha no keychain marca na conta
																            updateConta(true);
																						$("#touchid").prop("checked", true).checkboxradio('refresh');
																          },
																          function(error) {
																            //apenas loga no console no momento
																						//TODO: msg box informando erro em ativar touchid
																            console.log('error salve to keychain:' + error);

																						//retira o tick
																						$("#touchid").prop("checked", false).checkboxradio('refresh');

																          }
																        );

																},
	                              function(error) {
																	  console.log('error touchid:' + error);
																		//retira o tick
																		$("#touchid").prop("checked", false).checkboxradio('refresh');
																});

			} else {
				//remove senha do keychain
				AWBE.Components.Keychain.remove(conta.cpf);

				updateConta(false);

			}



			return false;
		});

function updateConta(useTouchID) {
  console.log("updateConta");
  var contas = BradescoCartoesMobile.meusCartoesController.getContas();
  var conta = AWBE.sessionStorage.getItem('user');

  for(var k in contas) {
    if(conta.cpf == contas[k].cpf) {
      console.log("found account");
      contas[k].touchID = useTouchID;
      conta.touchID = useTouchID;
      AWBE.sessionStorage.setItem('user', conta);
      break;
    }
  }

  AWBE.localStorage.setItem('contas', JSON.stringify(contas));
}
