/**
 * HOOKS
 */

/**
 * Implements hook_form_alter().
 */
function local_forms_form_alter(form, form_state, form_id) {
  try {
    
    //dpm(form_id);
    
    // Skip all forms that aren't set for local storage.
    if ($.inArray(form_id, local_forms_get_forms()) == -1) { return; }
    
    /*dpm('local_forms_form_alter');
    console.log(form);
    console.log(form_state);*/
    
    // Set aside the the form's default submit handler inside the form, then
    // replace the form's default submit handler with ours. Then since we set
    // aside the original submission handler in the form, we can get it back
    // from local storage during submission, which will allow us to queue it
    // for later submission.
    form.local_forms = { };
    $.each(form.submit, function(index, submit) {
        
        // Skip non default submission handlers.
        if (submit != form_id + '_submit') { return; }
        
        form.local_forms.submit = submit;
        form.submit[index] = 'local_forms_submit';

    });

    // If we have any values in local storage, place them back into the form.
    var values = variable_get(local_forms_storage_id(form), null);
    if (values) {
      values = JSON.parse(values);
      $.each(form.elements, function(name, element) {
          if (typeof values[name] === 'undefined') { return; }
          form.elements[name].value = values[name];
      });
    }

  }
  catch (error) { console.log('local_forms_form_alter - ' + error); }
}

/**
 * Postprocess a service call.
 * @param {Object} options
 * @param {Object} result
 */
function local_forms_services_postprocess(options, result) {
  try {
    
    // After a system connect call, we'll assume the user has a connection. At
    // this time submit any forms that were previously queued up.
    if (options.service == 'system' && options.resource == 'connect') {
      var queue = local_forms_get_submission_queue();
      for (var i = 0; i < queue.length; i++) {
        var fn = window[queue[i].submit];
        fn(queue[i].form, queue[i].form_state);
      }
      local_forms_clear_submission_queue();
    }
    else {
      
      // All other service resources...
      
      // Support the Webform module.
      if (module_exists('webform') && options.service == 'webform') {
  
        if (options.resource == 'submissions') {
          
          //dpm('local forms webform!');
          //console.log(result);
          
        }
  
      }  
      
    }

  }
  catch (error) { console.log('local_forms_services_postprocess - ' + error); }
}

/**
 * FORMS
 */

/**
 *
 */
function local_forms_submit(form, form_state) {
  try {
    // Queue the submission.
    local_forms_queue_submission(form, form_state);
    // Place the form state values in local storage.
    variable_set(local_forms_storage_id(form), JSON.stringify(form_state.values));
  }
  catch (error) { console.log('local_forms_submit - ' + error); }
}

/**
 * HELPERS
 */

/**
 *
 */
function local_forms_get_forms() {
  try {
    return drupalgap.settings.local_forms.forms;
  }
  catch (error) { console.log('local_forms_get_forms - ' + error); }
}

/**
 *
 */
function local_forms_storage_id(form) {
  try {
    return 'local_forms_' + form.id;
  }
  catch (error) { console.log('local_forms_storage_id - ' + error); }
}

/**
 *
 */
function local_forms_get_submission_queue() {
  try {
    var queue = variable_get('local_forms_submission_queue', []);
    if (typeof queue === 'string') { queue = JSON.parse(queue); }
    return queue;
  }
  catch (error) { console.log('local_forms_get_submission_queue - ' + error); }
}

/**
 *
 */
function local_forms_clear_submission_queue() {
  try {
    variable_set('local_forms_submission_queue', []);
  }
  catch (error) { console.log('local_forms_clear_submission_queue - ' + error); }
}

/**
 *
 */
function local_forms_queue_submission(form, form_state) {
  try {
    var queue = local_forms_get_submission_queue();
    queue.push({
        submit: form.local_forms.submit,
        form: form,
        form_state: form_state
    });
    variable_set('local_forms_submission_queue', queue);
  }
  catch (error) { console.log('local_forms_queue_submission - ' + error); }
}

