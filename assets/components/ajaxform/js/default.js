var AjaxForm = {

	initialize: function() {
		if(!jQuery().ajaxForm) {
			document.write('<script src="'+afConfig.assetsUrl+'js/lib/jquery.form.min.js"><\/script>');
		}
		if(!jQuery().jGrowl) {
			document.write('<script src="'+afConfig.assetsUrl+'js/lib/jquery.jgrowl.min.js"><\/script>');
		}

		$(document).ready(function() {
			$.jGrowl.defaults.closerTemplate = '<div>[ '+afConfig.closeMessage+' ]</div>';
		});

		$(document).on('submit', afConfig.formSelector, function(e) {
			$(this).ajaxSubmit({
				dataType: 'json'
				,url: afConfig.actionUrl
				,beforeSubmit: function(fields, form) {
					form.find('.error').html('');
					form.find('input,textarea,select,button').attr('disabled', true);
					return true;
				}
				,success: function(response, status, xhr, form) {
					form.find('input,textarea,select,button').attr('disabled', false);
					response.form=form;
					$(document).trigger("af_complete", response);
					if (!response.success) {
						AjaxForm.Message.error(response.message);
						if (response.data) {
							var key, value;
							for (key in response.data) {
								if (response.data.hasOwnProperty(key)) {
									value = response.data[key];
									form.find('.error_' + key).html(value).addClass('error');
									form.find('[name="' + key + '"]').addClass('error');
								}
							}
						}
					}
					else {
						AjaxForm.Message.success(response.message);
						form.find('.error').removeClass('error');
						form[0].reset();
					}
				}
			});
			e.preventDefault();
			return false;
		});

		$(document).on('reset', afConfig.formSelector, function(e) {
			$(this).find('.error').html('');
			AjaxForm.Message.close();
		});
	}

};




AjaxForm.Message = {
	success: function(message, sticky) {
		if (message) {
			if (!sticky) {sticky = false;}
			$.jGrowl(message, {theme: 'af-message-success', sticky: sticky});
		}
	}
	,error: function(message, sticky) {
		if (message) {
			if (!sticky) {sticky = false;}
			$.jGrowl(message, {theme: 'af-message-error', sticky: sticky});
		}
	}
	,info: function(message, sticky) {
		if (message) {
			if (!sticky) {sticky = false;}
			$.jGrowl(message, {theme: 'af-message-info', sticky: sticky});
		}
	}
	,close: function() {
		$.jGrowl('close');
	}
};



AjaxForm.initialize();
