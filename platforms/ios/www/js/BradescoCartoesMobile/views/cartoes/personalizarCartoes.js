$(function(){

	$('.cartaoCheckbox').on('click', function(event) {
		var target = $(event.target);
		var cartao = target.data('cartao');
		var continueDiv = $('.continue');
		var btnSubmit = $('#botaoSubmitLogin');
		if ($('.cartaoCheckbox:checked').length > 0) {
			continueDiv.removeClass('disabledButton');
			btnSubmit.attr('href', '#atualizarCartoesSelecionados');
		} else {
			continueDiv.addClass('disabledButton');
			btnSubmit.attr('href', 'javascript:void(0);');
		}
	});

	$('#botaoSubmitLogin').on('click', function(event) {
		var checked = $('.cartaoCheckbox:checked');
		if (checked.length > 0) {
			var user = AWBE.sessionStorage.getItem('user');
			var item = null;
			var cartao = null;
			/** marca todos os cartoes para não mostrar */
			for (item in user.cartoesPersonalizados) {
				user.cartoesPersonalizados[item].mostrar = false;
			}
			/** marca para mostrar os cartoes selecionados */
			for (var i = 0; i < checked.length; i++) {
				item = checked[i];
				cartao = $(item).data('cartao');
				if (user.cartoesPersonalizados[cartao]) {
					user.cartoesPersonalizados[cartao].mostrar = true;
				}
			}
			AWBE.sessionStorage.setItem('user', user);

			var contas = JSON.parse(AWBE.localStorage.getItem('contas'));
			for (c in contas) {
				if (contas[c].cpf == user.cpf) {
					contas[c].cartoesPersonalizados = user.cartoesPersonalizados;
					break;
				}
			}
			AWBE.localStorage.setItem('contas', JSON.stringify(contas));
		} else {
			return false;
		}
	});
})

setTimeout(function(){
	$.mobile.silentScroll(0);
},500);