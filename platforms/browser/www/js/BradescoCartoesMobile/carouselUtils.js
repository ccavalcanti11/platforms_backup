var CarouselUtils = (function () {

    var carouselUtils = {};

    carouselUtils.salvarValuesCarousel = function () {
        var widthCarousel = $('.slick-list .slick-track').width();
        var widthCartaoCarousel = $('.slick-track .slick-current').width();
        var transformCarousel = $('.slick-list .slick-track').css('transform');

        var valuesCarousel = {
            widthCarousel: widthCarousel,
            widthCartaoCarousel: widthCartaoCarousel,
            transformCarousel: transformCarousel
        }

        if (!checkIsEmpty(valuesCarousel)) return console.log('ERRO - salvarWidthCarousel - valores estao vazios');

        AWBE.sessionStorage.setItem('valuesCarousel', valuesCarousel);
    }

    carouselUtils.equalizarWidthCarousel = function () {
        var $carousel = $('.slick-list .slick-track');
        var $cartaoCarousel = $('.slick-track .slick-current');
        var $todosCartoesCarousel = $('.slick-list .slick-track').children();
        var widthCarousel = convertToPx(returnStoragedValue('widthCarousel'));
        var widthCartaoCarousel = convertToPx(returnStoragedValue('widthCartaoCarousel'));
        var valueTransform = returnStoragedValue('widthCartaoCarousel');

        //$cartaoCarousel.css('width', widthCartaoCarousel);
        //$todosCartoesCarousel.css('width', widthCartaoCarousel);
        $carousel.css('width', widthCarousel);

        var initialIndex = getSelectedIndex();

        
        //$carousel.css('transform', 'matrix(1, 0, 0, 1,' + (valueTransform * initialIndex) +',' +' 0)');
    }

    function returnStoragedValue(id) {
        var valuesCarousel = AWBE.sessionStorage.getItem('valuesCarousel');
        return valuesCarousel[id];
    }

    function checkIsEmpty(valuesCarousel) {
        if (isEmpty(valuesCarousel)) {
            console.log('ERRO - CarouselUtils - valor vazio');
            return false;
        }
        console.log('SUCESSO - CarouselUtils - valor preenchido');
        return true;
    }

    function convertToPx(val) {
        return val + "px";
    }

    function getSelectedIndex() {
        return -parseInt($('.slick-current').attr('data-slick-index'));
    };

    return {
        salvarValuesCarousel: carouselUtils.salvarValuesCarousel,
        equalizarWidthCarousel: carouselUtils.equalizarWidthCarousel,
        changePaddingCarousel: carouselUtils.changePaddingCarousel
    };
})();