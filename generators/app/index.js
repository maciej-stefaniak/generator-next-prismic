"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the laudable ${chalk.red(
          "generator-next-prismic"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "websiteName",
        message:
          "What would you like your website project (and folder) to be called?",
        filter: websiteName => {
          return websiteName
            .toLowerCase()
            .trim()
            .split(" ")
            .join("-");
        }
      },
      {
        type: "input",
        name: "websiteFullName",
        message: "What is the full name of the company/product?"
      },
      {
        type: "input",
        name: "websiteDescription",
        message:
          "What is the default description of the company/product? (can be changed later in constants)"
      },
      {
        type: "input",
        name: "websiteURL",
        message:
          "What will be the url of the site? (can be changed later in constants)"
      },
      {
        type: "checkbox",
        name: "baseComponents",
        choices: [
          { name: "LazyImg", checked: true },
          { name: "Portal", checked: true },
          { name: "Link", checked: true },
          { name: "Markdown", checked: true },
          { name: "ContentBlocks", checked: true }
        ],
        message: "Select the base components you would like to have?"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const websiteName = this.props.websiteName;
    this.destinationRoot(websiteName);

    this.props.baseComponents.map(component => {
      this.fs.copyTpl(
        `${this.templatePath()}/components/${component}/**/*`,
        `${this.destinationPath()}/components/${component}`,
        this.props
      );
      return component;
    });

    // Utils
    this.fs.copyTpl(
      `${this.templatePath()}/utils/**/*`,
      `${this.destinationPath()}/utils`,
      this.props
    );

    // Constants
    this.fs.copyTpl(
      `${this.templatePath()}/constants/**/*`,
      `${this.destinationPath()}/constants`,
      this.props
    );

    // Files on root. Mainly config files
    this.fs.copyTpl(
      `${this.templatePath()}/*`,
      this.destinationPath(),
      this.props
    );
  }

  install() {
    this.installDependencies({
      yarn: { force: true },
      npm: false,
      bower: false
    });
  }
};
