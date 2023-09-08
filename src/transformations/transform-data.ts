import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectExpression,
  ObjectProperty
} from "jscodeshift";

export function transformData(root: Collection<any>, j: JSCodeshift) {
  const dataBlock = root.find(j.ObjectMethod, { key: { name: 'data' } });
  const returnStatement = dataBlock.find(j.ReturnStatement);

  returnStatement.forEach(dataReturn => {
    const properties = (dataReturn.node.argument as ObjectExpression).properties as ObjectProperty[];

    properties.forEach(property => {
      const key = (property.key as Identifier).name;
      const value = property.value as any;

      const declaration = j.variableDeclaration('const', [
        j.variableDeclarator(
            j.identifier(key),
            j.callExpression(
                j.identifier('ref'), [value]
            ))
      ]);

      root.insertAfter(declaration);
    });
  });

  dataBlock.remove();
}


