# local_forms
The Local Forms module for DrupalGap.

# Usage
In your `settings.js` file, specify what services  will have be enabled for use
with the Local Forms module. For example, this enables the usage of webform_service
submission.create:

```
drupalgap.settings.local_forms['submission']['create'] = {};

```

