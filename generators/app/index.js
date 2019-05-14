'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

const { fixDotfiles } = require('./fix-dotfiles')

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
      new ${
        this.options.websiteName
          ? chalk.green(
              this.options.websiteName.replace(/\b\w/g, l => l.toUpperCase())
            )
          : ''
      } project`)
    )

    let prompts = []

    // If not websiteName declared then ask for it
    if (!this.options.websiteName || this.options.websiteName.length < 1) {
      prompts = [
        {
          type: 'input',
          name: 'websiteName',
          message: `What is the name of your project? ${chalk.gray(
            "will be the folder's name"
          )}`,
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
      ...prompts,
      {
        type: 'confirm',
        name: 'exportStatic',
        message: `Create a static-generated project for serverless deployment?`,
        default: true
      },
      {
        type: 'input',
        name: 'websiteFullName',
        message: `What is the full name of the company/product?`
      },
      {
        type: 'input',
        name: 'websiteDescription',
        message: `And the default description? ${chalk.gray(
          chalk.italic('(It can be changed later in constants)')
        )}`
      },
      {
        type: 'checkbox',
        name: 'languages',
        choices: [{ name: 'de', checked: true }, { name: 'en', checked: true }],
        message: `Select the base languages for your project? ${chalk.gray(
          chalk.italic(
            '(If differents languages are needed can be changed later in constants)'
          )
        )}`,
        validate: input => {
          if (input && input.length >= 1) {
            return true
          }

          return 'Select at least one language'
        }
      },
      {
        type: 'checkbox',
        name: 'baseComponents',
        choices: [
          { name: 'Demo', checked: true },
          { name: 'LazyImg', checked: true },
          { name: 'Portal', checked: true },
          { name: 'Link', checked: true },
          { name: 'Markdown', checked: true },
          { name: 'MetaData', checked: true },
          { name: 'ContentBlocks', checked: true },
          { name: 'Anims', checked: true },
          { name: 'PageTransitions', checked: false }
        ],
        message: 'Which base React Components you would like to have?'
      },
      {
        type: 'input',
        name: 'primaryColor',
        message: `Primary color for the site? ${chalk.gray(
          chalk.italic(
            '(can be changed later in components/Layout/common/colors.scss)'
          )
        )}`,
        validate: input => {
          const isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(input)
          if (isValidColor) {
            return true
          }

          return "That's not a valid hexadecimal color"
        }
      },
      {
        type: 'input',
        name: 'prismicApiURL',
        message: `What is the Prismic API URL for this project? ${chalk.gray(
          chalk.italic('(can be changed later in .env)')
        )}`,
        validate: input => {
          if (input && input.length >= 1) {
            return true
          }

          return 'Prismic API URL is required'
        }
      },
      {
        type: 'input',
        name: 'prismicApiToken',
        message: `What is the Prismic API Token for this project? ${chalk.gray(
          chalk.italic('(can be changed later in .env)')
        )}`,
        validate: input => {
          if (input && input.length >= 1) {
            return true
          }

          return 'Prismic API Token is required'
        }
      },
      {
        type: 'input',
        name: 'websiteURL',
        message: `What about the site's root URL? ${chalk.gray(
          chalk.italic('(It can be changed later in constants)')
        )}`,
        validate: input => {
          if (input && input.length >= 1) {
            return true
          }

          return 'Site root URL is required'
        }
      },
      {
        type: 'input',
        name: 'githubRepoUrl',
        message: `And what's the Github repository URL of the project? ${chalk.gray(
          chalk.italic(
            '(It can be changed later in read.me under Installation)'
          )
        )}`,
        validate: input => {
          if (
            input &&
            input.length >= 1 &&
            input.indexOf('https://github.com/') >= 0
          ) {
            return true
          }

          return 'Add a proper Github repository URL. It should start with https://github.com/'
        }
      }
    ]

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
    })
  }

  writing() {
    let websiteName =
      !this.options.websiteName || this.options.websiteName.length < 1
        ? this.props.websiteName
        : this.options.websiteName
    websiteName = websiteName
      .toLowerCase()
      .trim()
      .split(' ')
      .join('-')
    this.destinationRoot(websiteName)

    const props = { ...this.props, websiteName }

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
      this.destinationPath(),
      props
    )
    // Omit serverless config files
    if (!this.props.exportStatic) {
      this.fs.delete(`${this.destinationPath()}/constants/index.js`)
      this.fs.delete(`${this.destinationPath()}/server/prismic-serverless.js`)
      this.fs.delete(`${this.destinationPath()}/server/utils.js`)
    }
    // Omit pages/_app.js file if PageTransitions component is not present
    if (!this.props.baseComponents.includes('PageTransitions')) {
      this.fs.delete(`${this.destinationPath()}/pages/_app.tsx`)
    }

    // Files on root. Mainly config files
    this.fs.copyTpl(
      `${this.templatePath()}/config-files/*`,
      this.destinationPath(),
      props
    )
    this.fs.copyTpl(
      `${this.templatePath()}/config-files/.*`,
      this.destinationPath(),
      props
    )
    // Omit _.env and next.config.export.js file if not exportStatic
    if (!this.props.exportStatic) {
      this.fs.delete(`${this.destinationPath()}/next.config.export.js`)
      this.fs.delete(`${this.destinationPath()}/_.env`)
    }

    fixDotfiles(this)
  }

  install() {
    this.installDependencies({
      bower: false
    })
  }
}
