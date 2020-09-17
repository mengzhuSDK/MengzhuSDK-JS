// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const entriesFunc = function (globPath) {
	let files = glob.sync(globPath);
	let entries = [], entry, dirname, basename;

	for (let i = 0; i < files.length; i++) {
		entry = files[i];
		dirname = path.dirname(entry.replace(entry.split('/')[0] + '/', ''));
		basename = path.basename(entry);
		// entries.push(resolveApp(entry + '/' + basename + '.js'));
		entries.push(resolveApp(entry + '/index.js'));
	}
	return entries;
};

//entry与公共组件这些容易变化的放在modal包
let entriesMap = {
    modal: [resolveApp('src/index.js')],
};
module.exports = {
    appSrc: resolveApp('src'),
    appBuild: resolveApp("dist"),
	appNodeModules: resolveApp('node_modules'),
	//build时需要分包
	entriesMap: entriesMap,
};

