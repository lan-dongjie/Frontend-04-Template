var Generator = require('yeoman-generator')
const fs = require('fs')
const path = require('path')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  async initPackage() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
      },
      // {
      //   type: "confirm",
      //   name: "ts",
      //   message: "Use Typescript?"
      // }
    ]);
    const pkgJson = {
      "scripts": {
        "build": "webpack --config webpack.config.js",
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha"
      },
      devDependencies: {
      },
    }
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      { title: answers.name }
    )
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
    this.npmInstall(['vue'], { 'save-dev': false })
    this.npmInstall(['html-webpack-plugin', 'vue-loader', 'vue-template-compiler', 'vue-style-loader', 'css-loader', 'babel-loader'], { 'save-dev': true })
    this.npmInstall(["@babel/core", "@babel/preset-env", "@babel/register", "@istanbuljs/nyc-config-babel", "babel-plugin-istanbul"], { 'save-dev': true })
    this.npmInstall(["mocha", "nyc"], { 'save-dev': true })
    this.npmInstall(["webpack", "webpack-cli"], { 'save-dev': true })
  }

  copyFiles() {
    const fileDir = (filePath, befor) => {
      const files = fs.readdirSync(filePath);
      console.log('files', files);

      if (files) {
        files.forEach(file => {
          let curPath = filePath + "/" + file;

          if (fs.statSync(curPath).isDirectory()) {
            fileDir(curPath, befor ? `${befor}/${file}` : file)
          } else if (file !== 'index.html') {

            this.fs.copyTpl(
              this.templatePath(befor ? `./${befor}/${file}` : file),
              this.destinationPath(befor ? `./${befor}/${file}` : file),
            )
          }
        })
      }
    }
    fileDir(path.resolve(__dirname, './templates'))
  }
}