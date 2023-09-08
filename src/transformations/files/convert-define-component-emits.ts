import {ArrayExpression, Collection, ExportDefaultDeclaration, JSCodeshift, StringLiteral} from "jscodeshift";

export function convertDefineComponentEmits(root: Collection<any>, j: JSCodeshift, defineComponent: Collection<ExportDefaultDeclaration>) {
  let emitProperties = defineComponent.find(j.ObjectProperty, node => node.key.name === 'emit');
  let emitSet: StringLiteral[] = [];

  root.find(j.CallExpression, {
    callee:
      'emit'
  }).forEach(emitValue => {
    emitSet.push(j.stringLiteral((emitValue.node.arguments[0] as StringLiteral).value))
  })
  if (emitProperties.length === 0 && emitSet.length > 0) {
    let newNode = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier('emit'),
        j.callExpression(
          j.identifier('defineEmits'),
          [j.arrayExpression(emitSet)]
        ),
      )
    ]);
    defineComponent.insertAfter(newNode);
  }
  emitProperties.forEach(emitNodePath => {
    const {comments, value} = emitNodePath.node;
    emitSet.map(emitObject => (value as ArrayExpression).elements.push(j.stringLiteral(emitObject.value)))
    let newNode = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier('emit'),
        j.callExpression(
          j.identifier('defineEmits'),
          [j.arrayExpression((value as ArrayExpression).elements)]
        ),
      )
    ]);
    newNode.comments = comments;
    defineComponent.insertAfter(newNode);
  });
  emitProperties.remove();
}
