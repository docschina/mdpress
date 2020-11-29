'use strict';

/**
 * Module dependencies.
 */

const { chalk, semver } = require('@mdpress/shared-utils');

/**
 * Check if Node version meets MdPress requirement.
 */

module.exports = function checkEnv (pkg) {
  const requiredVersion = pkg.engines.node;

  if (!semver.satisfies(process.version, requiredVersion)) {
    console.log(chalk.red(
      '\n[mdpress] minimum Node version not met:'
      + `\nYou are using Node ${process.version}, but MdPress `
      + `requires Node ${requiredVersion}.\nPlease upgrade your Node version.\n`
    ));
    process.exit(1);
  }
};
