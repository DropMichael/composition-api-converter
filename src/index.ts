const {run: jscodeshift} = require('jscodeshift/src/Runner')
const path = require('node:path');

const transformPath = path.join(__dirname, 'composition-api.ts');
const paths = ['src/tests']
const options = {
    dry: true,
    print: true,
    verbose: 1,
}

async function runTransformations() {
    const res = await jscodeshift(transformPath, paths, options)
    console.log(res)
}

runTransformations();