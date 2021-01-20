$(function() {
  $("#server").on("change", function() {
    var selectedServer = $(this).val();
    for (var count = 0; count < AWBE.ServerList.length; count++) {
      if (AWBE.ServerList[count].id == selectedServer) {
        AWBE.localStorage.setItem("serverIndex", count);
        AWBE.Properties.selectedServer = AWBE.ServerList[count];
        break;
      }
    }
  });

  $("#loginUnico").on("change", function() {
    var loginUnico = $(this).val();
    console.log("Login Unico selecionado: " + loginUnico);
    AWBE.localStorage.setItem("loginUnico", loginUnico);
  });
  
  $("#stoneAge").on("change", function() {
	  var selectedServer = $(this).val();
	    for (var count = 0; count < AWBE.sta.length; count++) {
	      if (AWBE.sta[count].id == selectedServer) {
	        AWBE.localStorage.setItem("staIndex", count);
	        AWBE.Properties.selectedSta = AWBE.sta[count];
	        break;
	      }
	    }
  });

  $("#habilitaValidaEmailID").on("change", function() {
      var habilitaValidaEmail = $(this).val();
      console.log("Habilita Validacao de Email Cadastrado: " + habilitaValidaEmail);
      AWBE.localStorage.setItem("habilitaValidaEmail", habilitaValidaEmail);
  });

  $("#habilitaMaquinaEstadoID").on("change", function() {
      var habilitaMaquinaEstado = $(this).val();
      console.log("Habilita máquina de estado: " + habilitaMaquinaEstado);
      AWBE.localStorage.setItem("habilitaMaquinaEstado", habilitaMaquinaEstado);
  });

  $("#habilitaValidaCodigoEmailSMSID").on("change", function() {
      var habilitaValidaCodigoEmailSMS = $(this).val();
      console.log("Habilita Validacao de Codigo de Email e SMS: " + habilitaValidaCodigoEmailSMS);
      AWBE.localStorage.setItem("habilitaValidaCodigoEmailSMS", habilitaValidaCodigoEmailSMS);
  });

  $("#simulaContaCorrenteCanceladaID").on("change", function() {
      var simulaContaCorrenteCancelada = $(this).val();
      console.log("Simula que a Conta Corrente foi cancelada: " + simulaContaCorrenteCancelada);
      AWBE.localStorage.setItem("simulaContaCorrenteCancelada", simulaContaCorrenteCancelada);
  });

  $("#smicServer").on("change", function () {
    var selectedSmicServer = $(this).val();
    for (var count = 0; count < AWBE.SmicServerList.length; count++) {
      if (AWBE.SmicServerList[count].id == selectedSmicServer) {
        AWBE.localStorage.setItem("smicServerIndex", count);
        AWBE.Properties.selectedSmicServer = AWBE.SmicServerList[count];
        break;
      }
    }
  });

  $("#mockP2Bradescard").on('click', function(){
    var cpf = prompt('insira o cpf');
    if(cpf){
      var msg = "CPF mockado ".concat(cpf);
      AWBE.localStorage.setItem("CPF_P2", cpf);
    } else {
      var msg = "Nenhum cpf cadastrado";
      AWBE.localStorage.removeItem("CPF_P2");
    }

    $("#msg_mock_p2").text(msg);
  })
  
});

$("#qrCodeBtn").click(function(){
  AWBE.localStorage.setItem("QRCODE", "true");
  window.location.href = '#meusCartoes';
});