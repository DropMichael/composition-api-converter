import {API, FileInfo} from "jscodeshift";
import {Options} from "jscodeshift/src/core";
import {transformProps} from "./transformations/transform-props";
import {transformMethods} from "./transformations/transform-methods";

module.exports = function(fileInfo: FileInfo, api: API, options: Options) {
    console.log(fileInfo.source)

    const {j} = api;
    const root = j(fileInfo.source);

    const rootNode = root.find(j.ExportDefaultDeclaration);

    transformProps(rootNode, j);
    transformMethods(rootNode, j);

    return root
        .toSource();
};

module.exports.parser = 'babylon';