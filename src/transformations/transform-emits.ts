import {ArrayExpression, Collection, JSCodeshift} from "jscodeshift";

export function transformEmits(root: Collection<any>, j: JSCodeshift) {
    const emitProperties = root.find(j.ObjectProperty, {
        key: {
            name: 'emit'
        }
    });

    emitProperties.forEach(emitNodePath => {
        const {comments, value} = emitNodePath.node;
        const newNode = j.variableDeclaration('const', [
            j.variableDeclarator(
                j.identifier('emits'),
                j.callExpression(
                    j.identifier('defineEmits'),
                    [j.arrayExpression((value as ArrayExpression).elements)]
                ),
            )
        ]);
        newNode.comments = comments;
        root.insertAfter(newNode);
    });

    emitProperties.remove();
}
