import {
    ArrowFunctionExpression,
    BlockStatement,
    Collection,
    Identifier,
    JSCodeshift,
    ObjectExpression,
    ObjectMethod,
    ObjectProperty
} from "jscodeshift";

export function transformMethods(root: Collection<any>, j: JSCodeshift) {
    /* Findet die methods properties innerhalb des roots. */
    let methods = root.find(j.ObjectProperty, {
        key: {
            name: 'methods'
        }
    });
    /* Die Funktion nimmt eine Liste von "Method-Nodes" (methodNodePath) und iteriert durch sie. */
    methods.forEach(methodNodePath => {
        /* Der Wert der aktuellen Node (methodNodePath.node.value) wird als ObjectExpression interpretiert und in als value zwischengespeichert. */
        const value: ObjectExpression = methodNodePath.node.value as ObjectExpression;
        /* Iteration durch die properties von Value, die entweder vom Typ ObjectMethod oder ObjectProperty sind. */
        (value.properties as (ObjectMethod | ObjectProperty)[]).forEach((method: ObjectProperty | ObjectMethod) => {
            /* Der Name der Methode wird als Identifier für die neue Funktionsdeklaration gesetzt. */
            const identifier: Identifier = j.identifier((method.key as Identifier).name);
            /* Überprüfung, ob die method eine ObjectMethod ist, bzw ob die jeweiligen keys vorhanden sind.*/
            const isObjectMethod = 'params' in method && 'body' in method && 'async' in method;
            /* Setzt verschiedene values der method als Konstante, je nachdem ob sie ein ObjectMethod oder eine ArrowFunctionExpression ist. */
            const {
                params,
                body,
                async,
                comments,
                returnType
            } = isObjectMethod ? method : (method as ObjectProperty).value as ArrowFunctionExpression;
            /* Erstellt eine neue Funktionsdeklaration. */
            const declaration = j.functionDeclaration(
                identifier,
                params,
                body as BlockStatement
            );
            /* Fügt der Funktionsdeklaration zusätzliche Informationen wie async, comments und return types hinzu */
            declaration.async = async;
            declaration.comments = comments;
            declaration.returnType = returnType;
            /* Fügt die neue Funktiondeklaration dem root-AST hinzu.*/
            root.insertAfter(declaration);
        });
    });
    /* Entfernt das methods blockstatement vom root */
    methods.remove();
}
