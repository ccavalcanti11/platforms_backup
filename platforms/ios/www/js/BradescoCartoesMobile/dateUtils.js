var dateUtils = (function () {
  var DateUtils = {}

  DateUtils.isInitDateValid = function (currentDate, selectedDate) {
    currentDate = currentDate.getTime();
    selectedDate = selectedDate.getTime();
    var maxDate = new Date().setDate(new Date().getDate() - 265);
    maxDate = this.getNewDateObj(this.convertDateStringToObj(this.getDateString(maxDate)));
    maxDate = maxDate.getTime();

    //selectedDate não pode ser maior ou igual que currentDate.
    if (selectedDate >= currentDate) {
      return false;
    }
    //selectedDate não pode ser menor que 240 dias a partir da currentDate
    if (selectedDate < maxDate) {
      return false;
    }

    return true;

  }

  DateUtils.isMaxDateValid = function (currentDate, selectedDate, minSelectedDate) {
    currentDate = currentDate.getTime();
    selectedDate = selectedDate.getTime();
    minSelectedDate = minSelectedDate.getTime();

    //selectedDate não pode ser maior ou igual que a data atual
    if (selectedDate >= currentDate) {
      return false;
    }
    //selectedDate não pode ser menor que a data minima selecionada
    if (selectedDate < minSelectedDate) {
      return false;
    }

    return true;

  }

  DateUtils.convertDateToInt = function (dateAsString) {
    //We expect YYYY-MM-DD

    var year = dateAsString.substring(0, 4);
    var month = dateAsString.substring(5, 7);
    var day = dateAsString.substring(8, 10);

    //output YYYYMMDD as an integer
    return parseInt(year + month + day);
  }


  DateUtils.getCurrentDateString = function () {
    return new Date().toISOString().split('T')[0];
  }

  DateUtils.getDateString = function (dateMili) {
    //provide date in milliseconds
    return new Date(dateMili).toISOString().split('T')[0]
  }

  DateUtils.getCurrentDateObj = function () {
    return this.getCurrentDateString().split('-');
  }

  DateUtils.convertDateStringToObj = function (dateString) {
    //dateString format: YYYY-MM-DD
    return dateString.split('-');
  }

  DateUtils.getNewDateObj = function (dateObj) {
    return new Date(dateObj[0], dateObj[1] - 1, dateObj[2]);
  }

  return {
    isInitDateValid: DateUtils.isInitDateValid,
    isMaxDateValid: DateUtils.isMaxDateValid,
    getCurrentDateString: DateUtils.getCurrentDateString,
    convertDateToInt: DateUtils.convertDateToInt,
    getCurrentDateObj: DateUtils.getCurrentDateObj,
    getNewDateObj: DateUtils.getNewDateObj,
    convertDateStringToObj: DateUtils.convertDateStringToObj,
    getDateString: DateUtils.getDateString
  }
})()