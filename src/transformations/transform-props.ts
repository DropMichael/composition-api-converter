import {Collection, JSCodeshift, ObjectExpression} from "jscodeshift";


export function transformProps(root: Collection<any>, j: JSCodeshift) {
    const props = root.find(j.ObjectProperty,
        {key: {name: 'props'}});
    props.forEach(propNodePath => {
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
        root.insertAfter(newNode);
    });
    props.remove();
}