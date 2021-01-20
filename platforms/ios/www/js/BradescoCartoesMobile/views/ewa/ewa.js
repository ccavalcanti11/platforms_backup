
function habilitarDispositivo(codigoDispositivo){
    AWBE.sessionStorage.setItem('codigoDispositivoApplePay', codigoDispositivo);
    window.location.href='#ewaConfirmarDispositivo';
}
