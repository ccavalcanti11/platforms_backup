var devicePlatform = window.device.platform;
if (devicePlatform.contains('iOS')) {
    console.log('detectado iPhone');
    $('#carouselTarget .ui-grid-a').first().addClass('flex-superProtegido');
}