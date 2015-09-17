/**
 * HOOKS
 */


/**
 * Implements hook_install().
 */
function local_forms_install() {
  document.addEventListener("offline", _onOffline, false);
  document.addEventListener("online", _onOnline, false);
}
function _onOffline() {
  drupalgap.online = false;
}
function _onOnline() {
  drupalgap.online = true;
  // TODO: reload page 
}

function local_forms_services_postprocess(submission, request) {
  try {
    if(request==0){
      if (typeof drupalgap.settings.local_forms === 'undefined' ||
          typeof drupalgap.settings.local_forms[submission.service] === 'undefined'||
          typeof drupalgap.settings.local_forms[submission.service][submission.resource] === 'undefined')
        return;
      local_forms_queue_submission(submission);
      // TODO: clear form?
//       if(submission.tries==1)
//         drupalgap_goto(drupalgap.settings.front); // on error, go home!
    }else{
      // the last post was successful, send another
      var submission = local_forms_dequeue_submission();
      if(typeof submission !== 'undefined')
        Drupal.services.call(submission);
    }
  }
  catch (error) { console.log('local_forms_services_postprocess - ' + error); }
}

/**
 * HELPERS
 */

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
function local_forms_set_submission_queue(queue) {
  try {
    variable_set('local_forms_submission_queue', queue);
  }
  catch (error) { console.log('local_forms_set_submission_queue - ' + error); }
}

/**
 *
 */
function local_forms_queue_submission(submission) {
  try {
    var queue = local_forms_get_submission_queue();
    queue.push(submission);
    local_forms_set_submission_queue(queue);
  }
  catch (error) { console.log('local_forms_queue_submission - ' + error); }
}

/**
 * Returns the oldest submission if any, undefined otherwise
 */
function local_forms_dequeue_submission() {
  try {
    var queue = local_forms_get_submission_queue();
    var submission = queue.shift();
    local_forms_set_submission_queue(queue);
    return submission;
  }
  catch (error) { console.log('local_forms_dequeue_submission - ' + error); }
}