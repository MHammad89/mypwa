const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  
  // Define the environment mode
  mode: 'development', // Use 'production' for production environment
  
  // Entry point of your application
  entry: './src/index.js',

  // Output configuration for bundled code
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  // Configuration for the development server
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8081,
  },
  
  // Add more configurations here as needed
  //... rest of the webpack.config.js
plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html'
    })
  ]



  
};