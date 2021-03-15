import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';

export function compileWithWebpack (file, extraConfig, cb) {
  const config = Object.assign({
    mode: 'development',
    entry: path.resolve(__dirname, '../fixtures', file),
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            'plugins': [
              require.resolve('babel-plugin-syntax-dynamic-import'),
            ],
            'presets': [
              require.resolve('babel-preset-es2015')
            ],
            'babelrc': false
          }
        },
        {
          test: /async-.*\.js$/,
          loader: require.resolve('./async-loader')
        },
        {
          test: /\.(png|woff2|css)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    }
  }, extraConfig);

  const compiler = webpack(config);
  const fs = new MemoryFS();
  compiler.outputFileSystem = fs;

  compiler.run((err, stats) => {
    expect(err).toBeFalsy();
    const errors = stats.hasErrors();
    if (errors) {
      console.log(stats.toString());
    }
    expect(errors).toBeFalsy();
    cb(fs);
  });
}
