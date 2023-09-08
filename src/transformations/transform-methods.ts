import {
  ArrowFunctionExpression, BlockStatement,
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
  methods.forEach(methodNodePath => {
    const value = methodNodePath.node.value as ObjectExpression;

    (value.properties as (ObjectMethod|ObjectProperty)[]).forEach(method => {
      const identifier = j.identifier((method.key as Identifier).name);
      const isObjectMethod = 'params' in method && 'body' in method && 'async' in method;
      const { params, body, async, comments, returnType } = isObjectMethod ? method : (method as ObjectProperty).value as ArrowFunctionExpression;

      const declaration = j.functionDeclaration(
          identifier,
          params,
          body as BlockStatement
      );
      declaration.async = async;
      declaration.comments = comments;
      declaration.returnType = returnType;

      root.insertAfter(declaration);
    });
  });

  methods.remove();
}
