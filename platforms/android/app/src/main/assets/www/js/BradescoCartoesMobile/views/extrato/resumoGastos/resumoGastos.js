$('.rc-title').hide();
$('.extrato-lancamentos').hide();
$('#titleSlide0').show();
$('#resumoSlide0').show();

var $element = $('.carouselDetalheExtrato');

$element.on('afterChange', function(event, slick, currentSlide) {
	$('.rc-title').hide();
	$('.extrato-lancamentos').hide();
	$('#titleSlide' + currentSlide).show();
	$('#resumoSlide' + currentSlide).show();
});

$element.slick({
    centerMode: true,
    arrows: false,
    slidesToShow: 1,
    variableWidth: false,
    dots: true,
    infinite: true
});

setTimeout(function() {
	$.mobile.silentScroll(0);
}, 500);
