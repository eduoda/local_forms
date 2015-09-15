/**
 * HOOKS
 */


/**
 * Implements hook_install().
 */
// function local_forms_install() {
//   document.addEventListener("offline", _onOffline, false);
//   document.addEventListener("online", _onOnline, false);
// }
// function _onOffline() {
// //   drupalgap.online = false;
// }
// function _onOnline() {
// //   drupalgap.online = true;
// //   drupalgap_alert('on');
// }
function local_forms_services_postprocess(options, request) {
  // we start to resend submissions when some request was successful
  try {
    // the last post was successful, send another
    var submission = local_forms_dequeue_submission();
    if(typeof submission !== 'undefined')
      Drupal.services.call(submission);
  }
  catch (error) { console.log('local_forms_services_postprocess - ' + error); }
}

function local_forms_services_postprocess_error(submission, request) {
  try {
    if (typeof drupalgap.settings.local_forms === 'undefined' ||
        typeof drupalgap.settings.local_forms[submission.service] === 'undefined'||
        typeof drupalgap.settings.local_forms[submission.service][submission.resource] === 'undefined')
      return;
    local_forms_queue_submission(submission);
  }
  catch (error) { console.log('local_forms_services_postprocess_error - ' + error); }
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