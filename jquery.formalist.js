(function($) {
	$.formalist = function(form, options) {
		
		// default plugin options
		var defaults = {
			selector: ':radio,:checkbox,select',
			event: 'change',
			box: 'div.box',
			cascade: ':radio:checked:visible,:checkbox:checked:visible,select:visible option:selected',
			classwhenhidden: 'hidden',
			classwhenvisible: 'visible',
			hide: function(box) {hide(box);},
			show: function(box) {show(box);},
			correlate: function(box, field, type, value, name, id) {return correlate(box, field, type, value, name, id);}
		};
		
		// extend default plugin options with user's custom options
		var plugin = this;
		plugin.settings = $.extend({}, defaults, options);
		
		// override of the hide method
		if (!$.isFunction(plugin.settings.hide)) {
			plugin.settings.hide = hide;
		}
		
		// override of the show method
		if (!$.isFunction(plugin.settings.show)) {
			plugin.settings.show = show;
		}
		
		// override of the correlation method
		if (!$.isFunction(plugin.settings.correlate)) {
			plugin.settings.correlate = correlate;
		}
		
		// initializes the plugin
		function init() {
			
			// hides all box except first and hides all box that contains a "*" in the data-hide attribute
			plugin.settings.hide($(form).find(plugin.settings.box + ':not(:first),' + plugin.settings.box + '[data-hide~="*"]'));
			
			// shows all box that contains a "*" in the data-show attribute
			plugin.settings.show($(form).find(plugin.settings.box + '[data-show~="*"]'));
			
			// runs through all input fields that already matched the cascade constraint
			$(form).find(plugin.settings.cascade).each(function(){
				run(this, form);
			});
			
			// binds all input fields on a specific event
			$(form).find(plugin.settings.selector).bind(plugin.settings.event, function(){
				run(this, form);
			});
		}
		
		// runs input fields through specific tests
		function run(field, form) {
			
			// grabs properties from the input field
			var type = $(field).is('input') ? $(field).prop('type') : $(field).prop('tagName').toLowerCase();
			var value = $(field).val();
			var name = $(field).prop('name');
			var id = $(field).prop('id');
			
			// hides all input fields when the data-hide attribute contains a "*", or equals a specific value, or contains a specific name, or contains a specific identifier
			plugin.settings.hide($(form).find(plugin.settings.box + '[data-hide~="*"],' + plugin.settings.box + '[data-hide="' + value + '"],' + plugin.settings.box + '[data-hide~="' + name + '"],' + plugin.settings.box + '[data-hide~="' + id + '"]'));
			
			// shows all input fields when the data-show attribute contains a "*"
			plugin.settings.show($(form).find(plugin.settings.box + '[data-show~="*"]'));
			
			// shows all input fields when the data-show attribute equals a specific value, or contains a specific name, or contains a specific identifier
			$(form).find(plugin.settings.box + '[data-show="' + value + '"],' + plugin.settings.box + '[data-show~="' + name + '"],' + plugin.settings.box + '[data-show~="' + id + '"]').each(function(){
				
				// correlates the box with the captured input field
				if (plugin.settings.correlate(this, field, type, value, name, id)) {
					plugin.settings.show(this);
				} else {
					plugin.settings.hide(this);
				}
				
				// runs again through all input fields that matched the cascade constraint
				$(this).find(plugin.settings.cascade).each(function(){
					run(this, form);
				});
			});
		}
		
		// hides an box
		function hide(box) {
			$(box).removeClass(plugin.settings.classwhenvisible).addClass(plugin.settings.classwhenhidden);
		}
		
		// shows an box
		function show(box) {
			$(box).removeClass(plugin.settings.classwhenhidden).addClass(plugin.settings.classwhenvisible);
		}
		
		// correlation between box and field
		function correlate(box, field, type, value, name, id) {
			return type == 'select' ? $(field).has('option:selected') : $(field).is(':checked');
		}
		
		// initializes the plugin
		init();
	};
	
	// declares and instanciates the plugin
	$.fn.formalist = function(options) {
		return this.each(function() {
			if (undefined === $(this).data('formalist')) {
				var plugin = new $.formalist(this, options);
				$(this).data('formalist', plugin);
			}
		});
	};
})(jQuery);