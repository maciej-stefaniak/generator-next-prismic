'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    // This makes `websiteName` a possible argument
    this.argument('websiteName', { type: String, required: false })
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to our ${chalk.green('next-prismic')} generator!
      
      Let's create your 
      new ${chalk.green(
        this.options.websiteName.replace(/\b\w/g, l => l.toUpperCase())
      )} project`)
    )

    let prompts = []

    // If not websiteName declared then ask for it
    if (!this.options.websiteName) {
      prompts = [
        ...{
          type: 'input',
          name: 'websiteName',
          message:
            'What would you like your website project (and folder) to be called?',
          filter: websiteName => {
            return websiteName
              .toLowerCase()
              .trim()
              .split(' ')
              .join('-')
          }
        }
      ]
    }

    prompts = [
      ...[
        {
          type: 'input',
          name: 'websiteFullName',
          message: 'What is the full name of the company/product?'
        },
        {
          type: 'input',
          name: 'websiteDescription',
          message:
            'What is the default description of the company/product? (can be changed later in constants)'
        },
        {
          type: 'input',
          name: 'websiteURL',
          message:
            'What will be the url of the site? (can be changed later in constants)'
        },
        {
          type: 'checkbox',
          name: 'languages',
          choices: [
            { name: 'de', checked: true },
            { name: 'en', checked: true }
          ],
          message:
            'Select the base languages you would like to have? (If differents needed can be changed later in constants)'
        },
        {
          type: 'checkbox',
          name: 'baseComponents',
          choices: [
            { name: 'LazyImg', checked: true },
            { name: 'Portal', checked: true },
            { name: 'Link', checked: true },
            { name: 'Markdown', checked: true },
            { name: 'MetaData', checked: true },
            { name: 'ContentBlocks', checked: true }
          ],
          message: 'Select the base components you would like to have?',
          store: true
        },
        {
          type: 'input',
          name: 'primaryColor',
          message:
            'What will be primary hexadecimal color for the site? (can be changed later in components/Layout/common/colors.scss)',
          validate: input => {
            const isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(
              input
            )
            if (isValidColor) {
              return true
            }
            return "That's not a valid hexadecimal color"
          }
        }
      ]
    ]

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
    })
  }

  writing() {
    const websiteName = this.options.websiteName
    this.destinationRoot(websiteName)

    const props = { ...this.props, websiteName: this.options.websiteName }

    // Components
    this.props.baseComponents
      .concat(['Navbar', 'Footer', 'Layout'])
      .map(component => {
        this.fs.copyTpl(
          `${this.templatePath()}/components/${component}/**/*`,
          `${this.destinationPath()}/components/${component}`,
          props
        )
        return component
      })
    this.fs.copyTpl(
      `${this.templatePath()}/components/index.ts`,
      `${this.destinationPath()}/components/index.ts`,
      props
    )
    // ---

    // Constants, Store, Utils, ...
    this.fs.copyTpl(
      `${this.templatePath()}/generic/**/*`,
      `${this.destinationPath()}`,
      props
    )

    // Files on root. Mainly config files
    this.fs.copyTpl(
      `${this.templatePath()}/config-files/**/*`,
      this.destinationPath(),
      props
    )
  }

  install() {
    this.installDependencies({
      yarn: { force: true },
      npm: false,
      bower: false
    })
  }
}
