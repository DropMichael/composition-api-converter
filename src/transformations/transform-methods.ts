import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty
} from "jscodeshift";

export function transformMethods(root: Collection<any>, j: JSCodeshift) {
  let methods = root.find(j.ObjectProperty, {
    key: {
      name: 'methods'
    }
  });
  methods.forEach(method => {
    (method.value.value as ObjectExpression).properties.forEach(prop => {
      root.insertAfter(j.functionDeclaration(j.identifier(((prop as ObjectProperty).key as Identifier).name), (prop as ObjectMethod).params, (prop as ObjectMethod).body));
    })
    method.replace();
  });
}
