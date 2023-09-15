import {API, FileInfo} from "jscodeshift";
import {Options} from "jscodeshift/src/core";
import {transformProps} from "./transformations/transform-props";
import {transformMethods} from "./transformations/transform-methods";
import {transformData} from "./transformations/transform-data";
import {transformEmits} from "./transformations/transform-emits";

module.exports = function(fileInfo: FileInfo, api: API, options: Options) {
    const {j} = api;
    const root = j(fileInfo.source);

    const rootNode = root.find(j.ExportDefaultDeclaration);

    transformMethods(rootNode, j);
    transformData(rootNode, j);
    transformEmits(rootNode, j);
    transformProps(rootNode, j);

    return root
        .toSource();
};

module.exports.parser = 'babylon';