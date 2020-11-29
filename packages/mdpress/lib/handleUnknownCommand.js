'use strict';

/**
 * Module dependencies.
 */

const { createApp } = require('@mdpress/core');
const { path, logger, globby, chalk } = require('@mdpress/shared-utils');
const { isKnownCommand, CLI } = require('./util');
const pwd = process.cwd();

/**
 * Expose handleUnknownCommand function.
 */

module.exports = async function (cli, options) {
  registerUnknownCommands(cli, options);

  const argv = process.argv.slice(2);
  const inferredUserDocsDirectory = await inferUserDocsDirectory(pwd);
  logger.developer('inferredUserDocsDirectory', inferredUserDocsDirectory);

  const needPrepareBeforeLaunchCLI = inferredUserDocsDirectory
    && (isHelpFlag(argv[0]) || isUnknownCommandHelp(argv));

  logger.developer('needPrepareBeforeLaunchCLI', needPrepareBeforeLaunchCLI);

  if (needPrepareBeforeLaunchCLI) {
    let app;
    let [, sourceDir] = argv;

    if (!sourceDir || sourceDir.startsWith('-')) {
      sourceDir = inferredUserDocsDirectory;
    } else {
      sourceDir = pwd;
    }

    /* Prepare Context START */
    logger.setOptions({ logLevel: 1 });

    if (sourceDir) {
      app = createApp({ sourceDir, ...options });
      await app.process();
      app.pluginAPI.applySyncOption('extendCli', cli, app);
    }

    logger.setOptions({ logLevel: 3 });
    /* Prepare Context END */
  }
};

// When user type `mdpress [customCommand] --help`,
// MdPress will try to detect where user to place docs.

async function inferUserDocsDirectory (cwd) {
  const paths = await globby([
    '**/.mdpress/config.js',
    '!**/node_modules/**'
  ], {
    cwd,
    dot: true
  });
  const siteConfigPath = paths && paths[0];
  if (siteConfigPath) {
    return path.resolve(
      cwd,
      siteConfigPath.replace('.mdpress/config.js', '')
    );
  }
  return null;
}

/**
 * Register a command to match all unmatched commands
 * @param {CAC} cli
 */

function registerUnknownCommands (cli, options) {
  cli.on('command:*', async () => {
    const { args, options: commandoptions } = cli;

    logger.debug('global_options', options);
    logger.debug('cli_options', commandoptions);
    logger.debug('cli_args', args);

    const [commandName] = args;
    const sourceDir = args[1] ? path.resolve(args[1]) : pwd;
    const inferredUserDocsDirectory = await inferUserDocsDirectory(pwd);
    logger.developer('inferredUserDocsDirectory', inferredUserDocsDirectory);
    logger.developer('sourceDir', sourceDir);

    if (inferredUserDocsDirectory && sourceDir !== inferredUserDocsDirectory) {
      logUnknownCommand(cli);
      console.log();
      logger.tip(`Did you miss to specify the target docs dir? e.g. ${chalk.cyan(`mdpress ${commandName} [targetDir]`)}.`);
      logger.tip(`A custom command registered by a plugin requires MdPress to locate your site configuration like ${chalk.cyan('mdpress dev')} or ${chalk.cyan('mdpress build')}.`);
      console.log();
      process.exit(1);
    }

    if (!inferredUserDocsDirectory) {
      logUnknownCommand(cli);
      process.exit(1);
    }

    logger.debug('Custom command', chalk.cyan(commandName));
    CLI({
      async beforeParse (subCli) {
        /* Prepare Context START */
        logger.setOptions({ logLevel: 1 });

        const app = createApp({
          sourceDir: sourceDir,
          ...options,
          ...commandoptions
        });
        await app.process();

        logger.setOptions({ logLevel: 3 });
        /* Prepare Context END */

        app.pluginAPI.applySyncOption('extendCli', subCli, app);
        console.log();
      },
      async afterParse (subCli) {
        if (!subCli.matchedCommand) {
          logUnknownCommand(subCli);
          console.log();
        }
      }
    });
  });
}

function isHelpFlag (v) {
  return v === '--help' || v === '-h';
}

function isUnknownCommandHelp (argv) {
  return !isKnownCommand(argv) && isHelpFlag(argv[1]);
}

function logUnknownCommand (cli) {
  console.error('Unknown command: %s', cli.args.join(' '));
}

