const path = require('path')

/*
 * NPM, and therefore Yeoman, has an issue where it doesn't every include .npmignore, .gitignore or .env files in the bundled-up NPM package.
 * This means that Yeoman generators that want to create those files need to give them a different name in their template directories,
 * then move them to the right places.
 *
 * `fixDotfiles` will crawl the mem-fs store and find any files matching _.gitignore, _.npmignore or _.env and remove the leading underscore.
 * It should be called as the last step in the 'writing' lifecycle.
 */

const KNOWN_DOTFILES = {
  '_.gitignore': '.gitignore',
  '_.npmignore': '.npmignore',
  '_.env': '.env'
}

exports.fixDotfiles = function(generator) {
  generator.fs.store.each(file => {
    // Yeoman's mem-fs store includes your source directories *sigh*, so this filters those out.
    if (!isSubPath(generator.destinationPath(), file.path)) {
      return
    }
    const remap = KNOWN_DOTFILES[file.basename]
    if (remap) {
      generator.fs.move(file.path, file.dirname + '/' + remap)
    }
  })
}

function isSubPath(dir, file) {
  const relative = path.relative(dir, file)
  return (
    Boolean(relative) &&
    !relative.startsWith('..') &&
    !path.isAbsolute(relative)
  )
}
