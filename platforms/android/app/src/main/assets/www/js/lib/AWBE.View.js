var AWBE = AWBE || {};
AWBE.Views = AWBE.Views || {};

AWBE.Views.bindings = function() {
    var bindings = {};
   // Todos os tipos de elementos de FORM que ser�o verificados se existe o data-awbe-bind
   var elements = $.mobile.activePage.find(" datalist[data-awbe-bind]," +
										   " input[data-awbe-bind]," +
										   " keygen[data-awbe-bind]," +
										   " meter[data-awbe-bind]," +
										   " optgroup[data-awbe-bind]," +
										   " option[data-awbe-bind]," +
										   " output[data-awbe-bind]," +
										   " progress[data-awbe-bind]," +
										   " select[data-awbe-bind]," +
										   " textarea[data-awbe-bind]");
   
    for (var i = 0, size = elements.length; i < size; ++i) {
        
    	var data =  $(elements[i]).data('awbe-bind');
        
    	if ($(elements[i]).is(':radio') && !$(elements[i]).is(':checked')) {
    		data = undefined;
    	}
    		
    	if (data) {
            bindings[data] = elements[i].value;
        }
    }

    return bindings;
};

AWBE.Views.getCurrentView = function(){
	var viewName = AWBE.Controller.pageFromView($.mobile.activePage).view;
	return AWBE.Views.getView(viewName); 
};

AWBE.Views.getView = function(viewName) {
	//AWBE.log('== getView: ' + viewName);
	if(!AWBE.Views[viewName]) {
		//AWBE.log('=== getView - Loading view ' + viewName);

		$.ajax({
            type: 'GET',
            url: 'js/' + AWBE.Controller.applicationName + '/views/' + viewName + '.view',
            crossDomain: true,
            async: false,
            success: function(response) {
                html = response;
            }
        });

		/**
		 * utilizando o document.getElementById() pois viewName pode conter estrutura de pasta. E.g.:
		 * 
		 * viewName=subFolder/exampleView
		 * 
		 * Nesse exemplo, o viewName está na pasta em /views/subFolder. O arquivo .view em questão é exampleView.view
		 */
		if ($(document.getElementById(viewName + 'Page')).length == 0) {
            var page = document.createElement('div');

            $(page).data('role', 'page');
            page.setAttribute('id', viewName + 'Page');
            page.setAttribute('viewName', viewName);

            page.style.backgroundColor = '#fff';

            document.body.appendChild(page);
        }

        AWBE.Views[viewName] = {
            id: viewName,
            template: _.template(html),
            render: function(parameters, model) {
            	var pageElement = document.getElementById(this.id + 'Page'); 
                $(pageElement).html(this.template({params: parameters, model: model}));
                AWBE.Components.scan(pageElement, viewName);
                $.mobile.activePage.trigger('create');
            }
        };
	}

	return AWBE.Views[viewName];
};
