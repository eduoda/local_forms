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
    
    console.log(form);
    console.log(form_state);
    
    // Replace the default submission handler for the form with ours.
    $.each(form.submit, function(index, submit) {
        if (submit == form_id + '_submit') {
          form.submit[index] = 'local_forms_submit';
        }
    });
    
    // If we have any values in local storage, place them back into the form.
    var values = variable_get(local_forms_storage_id(form), null);
    if (values) {
      values = JSON.parse(values);
      console.log(values);
      $.each(form.elements, function(name, element) {
          if (typeof values[name] === 'undefined') { return; }
          form.elements[name].value = values[name];
      });
    }

  }
  catch (error) { console.log('local_forms_form_alter - ' + error); }
}

/**
 * FORMS
 */

/**
 *
 */
function local_forms_submit(form, form_state) {
  try {
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
