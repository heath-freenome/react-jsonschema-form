# Validation

When the form is submitted, the form data is validated to conform to the given JSON schema;

As of version 5, as a result of decoupling the validation implementation from the `Form`, a `validator` implementation is required to be passed to all `Form`s.
React Json Schema Form provides a default `@rjsf/validator-ajv6` implementation that uses version 6 of the [ajv](https://github.com/ajv-validator/ajv) validator.

> NOTE: The ajv6 validator has been deprecated from the outset in favor of the `@rjsf/validator-ajv8` and is provided primarily to assist in code migrations

It also provides a new `@rjsf/validator-ajv8` implementation that uses version 8 of the [ajv](https://github.com/ajv-validator/ajv) validator.
The error messages generated by this new validator differ from those provided by the original validator due to it using a newer version.
If you depend on having specifically formatted messages, then using this validator would constitute a breaking change for you.

It is also possible for you to provide your own implementation if you desire, as long as it fulfills the `ValidatorType` interface specified in `@rjsf/utils`.

## Live validation

By default, form data are only validated when the form is submitted or when a new `formData` prop is passed to the `Form` component.

You can enable live form data validation by passing a `liveValidate` prop to the `Form` component, and set it to `true`. Then, every time a value changes within the form data tree (e.g. the user entering a character in a field), a validation operation is performed, and the validation results are reflected into the form state.

Be warned that this is an expensive strategy, with possibly strong impact on performances.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  type: ["string"],
  const: "test"
};

const formData = "a";

render((
  <Form schema={schema} formData={formData} validator={validator} liveValidate />
), document.getElementById("app"));
```

## Validate form programmatically

It is possible to programmatically validate a form using the `validateForm()` function on `Form`.
Add a `ref` to your `Form` component and call the `validateForm()` method to validate the form programmatically.
The `validateForm()` method returns true if the form is valid, false otherwise.
If you have provided an `onError` callback it will be called with the list of errors when the `validatorForm()` method returns false.

```tsx
import { createRef } from "react"
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const formRef = createRef();
const onError = (errors) => alert(errors);

const schema: RJSFSchema = {
    type: "string"
};

render((
  <Form schema={schema} validator={validator} onError={onError} ref={formRef} />
), document.getElementById("app"));

if (formRef.current.validateForm()) {
  alert("Form is valid");
}
```

## HTML5 Validation

By default, the form uses HTML5 validation. This may cause unintuitive results because the HTML5 validation errors (such as when a field is `required`) may be displayed before the form is submitted, and thus these errors will display differently from the react-jsonschema-form validation errors. You can turn off HTML validation by setting the `noHtml5Validate` to `true`.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      required: true
    }
  }
};

render((
  <Form schema={schema} validator={validator} noHtml5Validate />
), document.getElementById("app"));
```

## Custom validation rules

Form data is always validated against the JSON schema.

But it is possible to define your own custom validation rules that will run in addition to (and after) the `validator` implementation.
This is especially useful when the validation depends on several interdependent fields.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

function customValidate(formData, errors, uiSchema) {
  if (formData.pass1 !== formData.pass2) {
    errors.pass2.addError("Passwords don't match");
  }
  return errors;
}

const schema: RJSFSchema = {
  type: "object",
  properties: {
    pass1: {type: "string", minLength: 3},
    pass2: {type: "string", minLength: 3},
  }
};

render((
  <Form schema={schema} validator={validator} customValidate={customValidate} />
), document.getElementById("app"));
```

> Notes:
> - The `customValidate()` function must implement the `CustomValidator` interface found in `@rjsf/utils`.
> - The `customValidate()` function must **always** return the `errors` object received as second argument.
> - The `customValidate()` function is called **after** the JSON schema validation.
> - The `customValidate()` function is passed the `uiSchema` as the third argument. This allows the `customValidate()` function to be able to derive additional information from it for generating errors.

## Custom error messages

Validation error messages are provided by the JSON Schema validation by default.
If you need to change these messages or make any other modifications to the errors from the JSON Schema validation, you can define a transform function that receives the list of JSON Schema errors and returns a new list.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

function transformErrors(errors, uiSchema) {
  return errors.map(error => {
    if (error.name === "pattern") {
      error.message = "Only digits are allowed"
    }
    return error;
  });
}

const schema: RJSFSchema = {
  type: "object",
  properties: {
    onlyNumbersString: {type: "string", pattern: "^\\d*$"},
  }
};

render((
  <Form schema={schema} validator={validator} transformErrors={transformErrors} />
), document.getElementById("app"));
```

> Notes:
> - The `transformErrors()` function must implement the `ErrorTransformer` interface found in `@rjsf/utils`.
> - The `transformErrors()` function must return the list of errors. Modifying the list in place without returning it will result in an error.
> - The `transformErrors()` function is passed the `uiSchema` as the second argument. This allows the `transformErrors()` function to be able to derive additional information from it for transforming errors.

Each element in the `errors` list passed to `transformErrors` is a `RJSFValidationError` interface (in `@rjsf/utils`) and has the following properties:

- `name`: optional name of the error, for example, "required" or "minLength"
- `message`: optional message, for example, "is a required property" or "should NOT be shorter than 3 characters"
- `params`: optional object with the error params returned by ajv ([see doc](https://github.com/ajv-validator/ajv/tree/6a671057ea6aae690b5967ee26a0ddf8452c6297#error-parameters) for more info).
- `property`: optional string in Javascript property accessor notation to the data path of the field with the error. For example, `.name` or `.first-name`.
- `schemaPath`: optional JSON pointer to the schema of the keyword that failed validation. For example, `#/fields/firstName/required`. (Note: this may sometimes be wrong due to a [bug in ajv](https://github.com/ajv-validator/ajv/issues/512)).
- `stack`: full error name, for example ".name is a required property".

## Error List Display

To take control over how the form errors are displayed, you can define an *error list template* for your form.
This list is the form global error list that appears at the top of your forms.

An error list template is basically a React stateless component being passed errors as props, so you can render them as you like:

```tsx
import { RJSFSchema, ErrorListProps } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

function ErrorListTemplate(props: ErrorListProps) {
  const { errors } = props;
  return (
    <div>
      <h2>Custom error list</h2>
      <ul>
        {errors.map(error => (
            <li key={error.stack}>
              {error.stack}
            </li>
          ))}
      </ul>
    </div>
  );
}

const schema: RJSFSchema = {
  type: "string",
  const: "test"
};

render((
  <Form schema={schema}
        validator={validator}
        showErrorList='top'
        formData={""}
        liveValidate
        templates: {{ ErrorListTemplate }} />
), document.getElementById("app"));
```

> Note: Your custom `ErrorList` template will only render when `showErrorList` is `top` or `botttom`.

The following props are passed to `ErrorList` as defined by the `ErrorListProps` interface in `@rjsf/utils`:

- `errors`: An array of the errors.
- `errorSchema`: The errorSchema constructed by `Form`.
- `schema`: The schema that was passed to `Form`.
- `uiSchema`: The uiSchema that was passed to `Form`.
- `formContext`: The `formContext` object that you passed to `Form`.

## The case of empty strings

When a text input is empty, the field in form data is set to `undefined`.
However, since `undefined` isn't a valid JSON value according to [the official JSON standard](https://www.ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf) (ECMA-404, Section 5), the values get stored as `null`.

String fields that use `enum` and a `select` widget will have an empty option at the top of the options list that when selected will result in the field being `null`.

One consequence of this is that if you have an empty string in your `enum` array, selecting that option in the `select` input will cause the field to be set to `null`, not an empty string.

If you want to have the field set to a default value when empty you can provide a `ui:emptyValue` field in the `uiSchema` object.

## Custom meta schema validation

To have your schemas validated against any other meta schema than draft-07 (the current version of [JSON Schema](http://json-schema.org/)), make sure your schema has a `$schema` attribute that enables the validator to use the correct meta schema.
For example:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  ...
}
```

Note that react-jsonschema-form supports JSON Schema draft-07 by default.
To support additional meta schemas, you can create and pass to the `Form` component a customized `@rjsf/validator-ajv8`:

### additionalMetaSchemas

The `additionalMetaSchemas` prop allows you to validate the form data against one (or more than one) JSON Schema meta schema, for example, JSON Schema draft-04.
You can import a meta schema as follows:

```tsx
const metaSchemaDraft04 = require("ajv/lib/refs/json-schema-draft-04.json");
```

In this example `schema` passed as props to `Form` component can be validated against draft-07 (default) and by draft-04 (added), depending on the value of `$schema` attribute.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv6';

const validator = customizeValidator({ additionalMetaSchemas: [metaSchemaDraft04] });

const schema: RJSFSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  type: "string"
};

return (<Form schema={schema} validator={validator} />);
```

NOTE: This syntax works only for the `@rjsf/validator-ajv6` validator; if you only use the `draft-04` schema and you want to use the `@rjsf/validator-ajv8` you can do the following:

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';
import AjvDraft04 from "ajv-draft-04";

const validator = customizeValidator({ AjvClass: AjvDraft04 });

const schema: RJSFSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  type: "string"
};

return (<Form schema={schema} validator={validator} />);
```

### customFormats

[Pre-defined semantic formats](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7) are limited.
react-jsonschema-form adds two formats, `color` and `data-url`, to support certain [alternative widgets](docs/usage/widgets.md).
To add formats of your own, you can create and pass to the `Form` component a customized `@rjsf/validator-ajv8`:

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  type: 'string',
  format: 'phone-us'
};

const customFormats = {
  'phone-us': /\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/
};

const validator = customizeValidator({ customFormats });

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

Format values can be anything AJV’s [`addFormat` method](https://github.com/ajv-validator/ajv/tree/6a671057ea6aae690b5967ee26a0ddf8452c6297#addformatstring-name-stringregexpfunctionobject-format---ajv) accepts.

### Async validation

Handling async errors is an important part of many applications. Support for this is added in the form of the `extraErrors` prop.

For example, a request could be made to some backend when the user submits the form. If that request fails, the errors returned by the backend should be formatted like in the following example.

```tsx
import { RJSFSchema, ErrorSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  type: "object",
  properties: {
    foo: {
      type: "string",
    },
    candy: {
      type: "object",
      properties: {
        bar: {
          type: "string",
        }
      }
    }
  }
};

const extraErrors: ErrorSchema = {
  foo: {
    __errors: ["some error that got added as a prop"],
  },
  candy: {
    bar: {
    __errors: ["some error that got added as a prop"],
    }
  }
};

render((
  <Form schema={schema} validator={validator} extraErrors={extraErrors} />
), document.getElementById("app"));
```

An important note is that these errors are "display only" and will not block the user from submitting the form again.

### ajvOptionsOverrides

In version 5, with the advent of the decoupling of the validation implementation from the `Form`, it is now possible to provide additional options to the `ajv6` instance used within `@rjsf/validator-ajv8`.
For instance, if you need more information from `ajv` about errors via the `verbose` option, now you can turn it on!

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  type: 'string',
  format: 'phone-us'
};

const ajvOptionsOverrides = {
  verbose: true,
};

const validator = customizeValidator({ ajvOptionsOverrides });

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

## Ajv8 validator differences

There are a few differences in configuring the Ajv 8 validator.
First, there are many things to be aware of related to internal migration from Ajv 6 to 8; see the [migration guide](https://ajv.js.org/v6-to-v8-migration.html) for more information.

One big difference is that Ajv 8 dropped support for any JSON Schema version before draft-06.
So if your schema is using an older format, you have to either upgrade it or stick with the `@rjsf/validator-ajv6`.

The `ajvOptionsOverrides` for the Ajv 8 validator are the ones supported by that version and not the Ajv 6 validator.
Second, the data formats previously provided in Ajv 6 now need to be added explicitly using the `ajv-formats` package.
A new `ajvFormatOptions` option is available on the `customizeValidator()` API to be able to configure this.
Additionally, a new `AjvClass` option is available on the `customizeValidator()` API to support using one of the other [JSON schema versions](https://ajv.js.org/json-schema.html#json-schema-versions) provided by Ajv 8 besides the `draft-07` default.
Finally, the Ajv 8 validator supports the localization of error messages.

### ajvFormatOptions

By default, ALL formats are being added to the default `@rjsf/validator-ajv8` that you get when you import it.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import validator from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  type: 'string',
  format: 'email'
};

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

If you don't actually need any of the [ajv-formats](https://github.com/ajv-validator/ajv-formats#formats) and want to reduce the memory footprint, then you can turn it off as follows:

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  type: 'string',
};

const validator = customizeValidator({ ajvFormatOptions: false });

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

If you only need some of them, you can pass any of the [options](https://github.com/ajv-validator/ajv-formats#options) to the formatter:

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  type: 'string',
  format: 'date'
};

const validator = customizeValidator({ ajvFormatOptions: ['date'] });
// or
// const validator = customizeValidator({ ajvFormatOptions: { mode: "fast", formats: ["date"], keywords: true } });

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

### AjvClass
By default, the `@rjsf/validator-ajv8` uses the `draft-07` schema version.
It is possible to use one of the other version it supports, like `draft-2019-09` or `draft-2020-12`.
NOTE: `draft-2020-12` has breaking changes and hasn't been fully tested with `@rjsf`.

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';
import Ajv2019 from "ajv/dist/2019";

const schema: RJSFSchema = {
  type: 'string',
  format: 'date'
};

const validator = customizeValidator({ AjvClass: Ajv2019 });
// or
// const validator = customizeValidator({ AjvClass: Ajv2020 });

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

### Localization (L12n) support

The Ajv 8 validator supports the localization of error messages using [ajv-i18n](https://github.com/ajv-validator/ajv-i18n).
In addition, you may provide a custom solution by implementing a function that conforms to the `Localizer` interface if your language is not supported.

```ts
import { ErrorObject } from "ajv";
/** The type describing a function that takes a list of Ajv `ErrorObject`s and localizes them
 */
export type Localizer = (errors?: null | ErrorObject[]) => void;
```

NOTE: The `ajv-i18n` validators implement the `Localizer` interface.

#### Some examples

Using a specific locale while including all of `ajv-i18n`:

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';
import localizer from "ajv-i18n";

const schema: RJSFSchema = {
  type: 'string',
};

const validator = customizeValidator({}, localizer.it);

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

Using a specific locale minimizing the bundle size

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';
import spanishLocalizer from "ajv-i18n/localize/es";

const schema: RJSFSchema = {
  type: 'string',
};

const validator = customizeValidator({}, spanishLocalizer);

render((
  <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

An example of a custom `Localizer` implementation:

```tsx
import { RJSFSchema } from "@rjsf/utils";
import { customizeValidator } from '@rjsf/validator-ajv8';
import { ErrorObject } from "ajv";

function localize_ru(errors: null | ErrorObject[] = []) {
  if (!(errors && errors.length)) return;
  errors.forEach(function(error) {
    let outMessage = "";

    switch (error.keyword) {
      case "pattern": {
        outMessage = 'должно соответствовать образцу "' + error.params.pattern + '"';
        break;
      }
      case "required": {
        outMessage = "поле обязательно для заполнения";
        break;
      }
      default:
        outMessage = error.message;
    }

    error.message = outMessage;
  })
}

const schema: RJSFSchema = {
  type: 'string',
};

const validator = customizeValidator({}, localize_ru);

render((
    <Form schema={schema} validator={validator} />
), document.getElementById("app"));
```

NOTES:

- If you provided your own function, modify the list in place.
- You must process all the cases which you need by yourself. See the full list of possible cases [here](https://github.com/ajv-validator/ajv-i18n/blob/master/messages/index.js).
- Each element in the `errors` list passed to the custom function represent a **raw** error object returned by ajv ([see doc](https://github.com/ajv-validator/ajv/blob/master/docs/api.md#error-objects)).