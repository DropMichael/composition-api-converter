import {Collection, ExportDefaultDeclaration, JSCodeshift, ObjectExpression} from "jscodeshift";

export function convertDefineComponentProps(root: Collection<any>, j: JSCodeshift, defineComponent: Collection<ExportDefaultDeclaration>) {
  const propsProperties = defineComponent.find(j.ObjectProperty, node => node.key.name === 'props');
  propsProperties.forEach(propNodePath => {
    const {comments, value} = propNodePath.node;
    const newNode = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier('props'),
        j.callExpression(
          j.identifier('defineProps'),
          [(value as ObjectExpression)]
        ),
      )
    ]);
    newNode.comments = comments;
    defineComponent.insertAfter(newNode);
  });
  propsProperties.remove();
}
