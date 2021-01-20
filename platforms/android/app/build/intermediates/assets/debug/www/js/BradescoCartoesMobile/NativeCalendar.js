'use strict';

/* VARIAVEIS */
var isOnSuccess = false;
var calendarList = [];


/* PERMISSÃO LEITURA */
function ncHasReadPermission(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessHasReadPermission; }
  window.plugins.calendar.hasReadPermission(onSuccessFunction);
  return isOnSuccess;
}
function ncHasReadPermissionGeneric(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessHasReadPermission; }
  window.plugins.calendar.hasReadPermission(onSuccessFunction);
}
function ncRequestReadPermission(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessRequestReadPermission; }
  window.plugins.calendar.requestReadPermission(onSuccessFunction);
}


/* PERMISSÃO ESCRITA */
function ncHasWritePermission(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessHasWritePermission; }
  window.plugins.calendar.hasWritePermission(onSuccessFunction);
  return isOnSuccess;
}
function ncHasWritePermissionGeneric(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessHasWritePermission; }
  window.plugins.calendar.hasWritePermission(onSuccessFunction);
}
function ncRequestWritePermission(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessRequestWritePermission; }
  window.plugins.calendar.requestWritePermission(onSuccessFunction);
}


/* PERMISSÃO LEITURA E ESCRITA */
function ncHasReadWritePermission(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessHasReadWritePermission; }
  window.plugins.calendar.hasReadWritePermission(onSuccessFunction);
  return isOnSuccess;
}
function ncHasReadWritePermissionGeneric(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessHasReadWritePermission; }
  window.plugins.calendar.hasReadWritePermission(onSuccessFunction);
}
function ncRequestReadWritePermission(onSuccessFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessRequestReadWritePermission; }
  window.plugins.calendar.requestReadWritePermission(onSuccessFunction);
}


/* CRIAR CALENDÁRIO */
function ncCreateCalendar(calendarName, calendarHTMLColor, onSuccessFunction, onErrorFunction) {
  if (calendarName == null || calendarHTMLColor == null) {
    console.log('CalendarioNativo: [createCalendar] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  var options = window.plugins.calendar.getCreateCalendarOptions();
  options.calendarName = calendarName;
  options.calendarColor = calendarHTMLColor;
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessCreateCalendar; }
  if (onErrorFunction == null) { onErrorFunction=onErrorCreateCalendar; }
  window.plugins.calendar.createCalendar(options, onSuccessFunction, onErrorFunction);
}


/* LISTAR CALENDÁRIOS */
function ncListCalendars(onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessListCalendars; }
  if (onErrorFunction == null) { onErrorFunction=onErrorListCalendars; }
  window.plugins.calendar.listCalendars(onSuccessFunction, onErrorFunction);
  return calendarList;
}


/* ABRIR CALENDÁRIO */
function ncOpenCalendar(day, onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessOpenCalendar; }
  if (onErrorFunction == null) { onErrorFunction=onErrorOpenCalendar; }
  window.plugins.calendar.openCalendar(day, onSuccessFunction, onErrorFunction);
}
function ncOpenTodayCalendar(onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessOpenTodayCalendar; }
  if (onErrorFunction == null) { onErrorFunction=onErrorOpenTodayCalendar; }
  window.plugins.calendar.openCalendar(new Date(), onSuccessFunction, onErrorFunction);
}
function ncOpenCalendarDaysFoward(daysFoward, onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessOpenCalendarDaysFoward; }
  if (onErrorFunction == null) { onErrorFunction=onErrorOpenCalendarDaysFoward; }
  var d = new Date(new Date().getTime() + daysFoward * 24 * 60 * 60 * 1000);
  window.plugins.calendar.openCalendar(d, onSuccessFunction, onErrorFunction);
}


/* CRIAR EVENTO NO CALENDÁRIO */

function ncCreateEventFull(events, onSuccessFunction, onErrorFunction) {
	if (events == null) {
    console.log('CalendarioNativo: [ncCreateEventFull] - Não foram informados todos os parametros obrigatórios');
    return;
  }
	if (onSuccessFunction == null) { onSuccessFunction = onSuccessCreateCalendarEvent; }
  if (onErrorFunction == null) { onErrorFunction = onErrorCreateCalendarEvent; }
	window.plugins.calendar.createEventFull(events, onSuccessFunction, onErrorFunction);
}

function ncCreateCalendarEventWithOptions(title, eventLocation, notes, startDate, endDate, calendarOptions, onSuccessFunction, onErrorFunction) {
  if (title == null || startDate == null || endDate == null || calendarOptions == null) {
    console.log('CalendarioNativo: [ncCreateCalendarEventWithOptions] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction = onSuccessCreateCalendarEvent; }
  if (onErrorFunction == null) { onErrorFunction = onErrorCreateCalendarEvent; }
  window.plugins.calendar.createEventWithOptions(title, eventLocation, notes, startDate, endDate, calendarOptions, onSuccessFunction, onErrorFunction);
}
function ncCreateCalendarEventSimple(title, eventLocation, notes, startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (title == null || startDate == null || endDate == null) {
    console.log('CalendarioNativo: [ncCreateCalendarEventSimple] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction = onSuccessCreateCalendarEvent; }
  if (onErrorFunction == null) { onErrorFunction = onErrorCreateCalendarEvent; }
  window.plugins.calendar.createEvent(title, eventLocation, notes, startDate, endDate, onSuccessFunction, onErrorFunction);
}
function ncCreateCalendarEventInNamedCalendar(title, eventLocation, notes, startDate, endDate, calendarName, onSuccessFunction, onErrorFunction) {
  if (title == null || startDate == null || endDate == null || calendarName == null) {
    console.log('CalendarioNativo: [ncCreateCalendarEventInNamedCalendar] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction = onSuccessCreateCalendarEvent; }
  if (onErrorFunction == null) { onErrorFunction = onErrorCreateCalendarEvent; }
  window.plugins.calendar.createEventInNamedCalendar(title, eventLocation, notes, startDate, endDate, calendarName, onSuccessFunction, onErrorFunction);
}


/* DELETAR EVENTO NO CALENDÁRIO */
function ncDeleteEventUsingDates(startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessDeleteEventUsingDates; }
  if (onErrorFunction == null) { onErrorFunction=onErrorDeleteEventUsingDates; }
  window.plugins.calendar.deleteEvent(null, null, null, startDate, endDate, onSuccessFunction, onErrorFunction);
}
function ncDeleteEventUsingTitleAndDates(title, startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessDeleteEventUsingTitleAndDates; }
  if (onErrorFunction == null) { onErrorFunction=onErrorDeleteEventUsingTitleAndDates; }
  window.plugins.calendar.deleteEvent(title, null, null, startDate, endDate, onSuccessFunction, onErrorFunction);
}
function ncDeleteEvent(title, eventLocation, notes, startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessDeleteEvent; }
  if (onErrorFunction == null) { onErrorFunction=onErrorDeleteEvent; }
  window.plugins.calendar.deleteEvent(title, eventLocation, notes, startDate, endDate, onSuccessFunction, onErrorFunction);
}


/* BUSCAR EVENTOS NO CALENDÁRIO */
function ncFindEventWithFilterDates(startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (startDate == null || endDate == null) {
    console.log('CalendarioNativo: [findEventWithFilterDates] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessFindEventWithFilterDates; }
  if (onErrorFunction == null) { onErrorFunction=onErrorFindEventWithFilterDates; }
  window.plugins.calendar.findEvent(null, null, null, startDate, endDate, onSuccessFunction, onErrorFunction);
}
function ncFindEventWithFilterTitleAndDates(title, startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (title == null || startDate == null || endDate == null) {
    console.log('CalendarioNativo: [findEventWithFilterTitleAndDates] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessFindEventWithFilterTitleAndDates; }
  if (onErrorFunction == null) { onErrorFunction=onErrorFindEventWithFilterTitleAndDates; }
  window.plugins.calendar.findEvent(title, null, null, startDate, endDate, onSuccessFunction, onErrorFunction);
}

function ncFindEventWithFilterAndOptions(title, startDate, endDate, calOptions, success, error){
	 if (title == null || startDate == null || endDate == null || calOptions == null) {
    console.log('CalendarioNativo: [ncFindEventWithFilterAndOptions] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessFindEventWithFilterTitleAndDates; }
  if (onErrorFunction == null) { onErrorFunction=onErrorFindEventWithFilterTitleAndDates; }
  window.plugins.calendar.findEventWithOptions(title,null,null,startDate,endDate,calOptions,success,error);
}

function ncFindEventWithFilter(title, eventLocation, notes, startDate, endDate, onSuccessFunction, onErrorFunction) {
  if (title == null || (eventLocation == null && notes == null) || startDate == null || endDate == null) {
    console.log('CalendarioNativo: [findEventWithFilter] - Não foram informados todos os parametros obrigatórios');
    return;
  }
  if (onSuccessFunction == null) { onSuccessFunction=onSuccessFindEventWithFilter; }
  if (onErrorFunction == null) { onErrorFunction=onErrorFindEventWithFilter; }
  window.plugins.calendar.findEvent(title, eventLocation, notes, startDate, endDate, onSuccessFunction, onErrorFunction);
}


/* DEFAULT ONSUCCESS/ONERROR */
function onSuccessHasReadPermission(response) {
  isOnSuccess = ncStringToBoolean(JSON.stringify(response));
}
function onSuccessRequestReadPermission(withoutResponse) { }

function onSuccessHasWritePermission(response) {
  isOnSuccess =  ncStringToBoolean(JSON.stringify(response));
}
function onSuccessRequestWritePermission(withoutResponse) { }

function onSuccessHasReadWritePermission(response) {
  isOnSuccess =  ncStringToBoolean(JSON.stringify(response));
}
function onSuccessRequestReadWritePermission(withoutResponse) { }

function onSuccessCreateCalendar(responseTRUE) {
	AWBE.sessionStorage.setItem('calendarioPadrao',JSON.stringify(responseTRUE));
}

function onErrorCreateCalendar(error){
  console.log('CalendarioNativo: [onErrorCreateCalendar] - Erro ao Criar um Calendário no Dispositivo: ' + error);
}

function onSuccessListCalendars(responseJSON) {
  /*
    WithResult
      id : Int
      name : String

    WithoutResult
      []
  */
  calendarList = responseJSON;
  AWBE.localStorage.setItem('calendarList', calendarList);
}
function onErrorListCalendars(error) {
  console.log('CalendarioNativo: [onErrorListCalendars] - Erro ao Listar Calendários no Dispositivo: ' + error);
}

function onSuccessOpenCalendar(responseOK) { }
function onErrorOpenCalendar(error) {
  console.log('CalendarioNativo: [onErrorOpenCalendar] - Erro ao Abrir o Calendário no Dispositivo: ' + error);
}

function onSuccessOpenTodayCalendar(responseOK) { }
function onErrorOpenTodayCalendar(error) {
  console.log('CalendarioNativo: [onErrorOpenTodayCalendar] - Erro ao Abrir o Calendário no dia de Hoje no Dispositivo: ' + error);
}

function onSuccessOpenCalendarDaysFoward(withoutResponse) { }
function onErrorOpenCalendarDaysFoward(error) {
  console.log('CalendarioNativo: [onErrorOpenCalendarDaysFoward] - Erro ao Abrir o Calendário no dia indicado (days foward) no Dispositivo: ' + error);
}

function onSuccessCreateCalendarEvent(responseCalendarID) { }
function onErrorCreateCalendarEvent(error) {
  console.log('CalendarioNativo: [onErrorCreateCalendarEvent] - Erro ao Criar Evento no Calendário: ' + error);
}

function onSuccessDeleteEventUsingDates(withoutResponse) { }
function onErrorDeleteEventUsingDates(error) {
  console.log('CalendarioNativo: [onErrorDeleteEventUsingDates] - Erro ao Deletar Evento do Calendário: ' + error);
}

function onSuccessDeleteEventUsingTitleAndDates(responseTRUE) { }
function onErrorDeleteEventUsingTitleAndDates(error) {
  console.log('CalendarioNativo: [onErrorDeleteEventUsingTitleAndDates] - Erro ao Deletar Evento do Calendário: ' + error);
}

function onSuccessDeleteEvent(responseTRUE) { }
function onErrorDeleteEvent(error) {
  console.log('CalendarioNativo: [onErrorDeleteEvent] - Erro ao Deletar Evento do Calendário: ' + error);
}

function onSuccessFindEventWithFilterDates(responseJSON) {
  /*
    WithResult
      id : Int
      title : String
      startDate : Date
      endDate : Date
      allday : Boolean

    WithoutResult
      []
  */
}
function onErrorFindEventWithFilterDates(error) {
  console.log('CalendarioNativo: [onErrorFindEventWithFilterDates] - Erro ao Buscar Evento no Calendário: ' + error);
}

function onSuccessFindEventWithFilterTitleAndDates(responseJSON) {
  /*
    WithResult
      id : Int
      title : String
      startDate : Date
      endDate : Date
      allday : Boolean

    WithoutResult
      []
  */
}
function onErrorFindEventWithFilterTitleAndDates(error) {
  console.log('CalendarioNativo: [onErrorFindEventWithFilterTitleAndDates] - Erro ao Buscar Evento no Calendário: ' + error);
}

function onSuccessFindEventWithFilter(responseJSON) {
  /*
    WithResult
      id : Int
      title : String
      startDate : Date
      endDate : Date
      allday : Boolean

    WithoutResult
      []
  */
}
function onErrorFindEventWithFilter(error) {
  console.log('CalendarioNativo: [onErrorFindEventWithFilter] - Erro ao Buscar Evento no Calendário: ' + error);
}


/* MÉTODOS AUXILIARES */
function ncStringToBoolean(string) {
  switch (string.toLowerCase().trim()) {
    case "true":
    case 'true':
    case "1":
        return true;
    case "false":
    case 'false':
    case "0":
    case null:
        return false;
    default:
        return false;
  }
}

function ncIsRipple() {
  if (AWBE.Platforms.runningOnRipple()) {
    console.log("RIPPLE: NativeCalendar - OFF");
    return true;
  } else {
    return false;
  }
}

function ncHasCalendarPermission(inputElement) {
  if (!ncHasReadWritePermission(null)) {
    if (inputElement.checked) {
      inputElement.checked = false;
    } else {
      inputElement.checked = true;
    }
    //ncRequestReadWritePermission(null);
    return false;
  } else {
    return true;
  }
}

function ncGetCalendarOptionObject() {
  return {
    url: null,
    calendarID: null,
    calendarName: null,

    recurrence: null,            /* opções: 'daily' 'weekly' 'monthly' 'yearly' */
    recurrenceInterval: 1,       /* valor somente usado quando existe recurrence */
    recurenceEndDate: null,

    firstReminderMinutes: 60,
    secondReminderNinutes: null
  }
}
