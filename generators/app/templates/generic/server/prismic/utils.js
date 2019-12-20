const {
  COMMON_DOCUMENTS,
  ALL_COMMON_DOCUMENTS,
  COMMON_DOCUMENTS_FOR_TYPE,
  COMMON_DOCUMENTS_FOR_TYPE_LISTED,
  COMMON_DOCUMENTS_FOR_BLOCK_LISTED,
  COMMON_DOCUMENTS_FOR_BLOCK
} = require('./constants')

const removeUnnecessaryData = (docType, contentBlocks = [], contentRes) => {
  let mayNeededByBlocks = []
  contentBlocks.map(({ slice_type }) => {
    if (
      COMMON_DOCUMENTS_FOR_BLOCK[slice_type] &&
      COMMON_DOCUMENTS_FOR_BLOCK[slice_type].length > 0
    ) {
      COMMON_DOCUMENTS_FOR_BLOCK[slice_type].map(document => {
        if (!mayNeededByBlocks.includes(document)) {
          mayNeededByBlocks.push(document)
        }
        return document
      })
    }
  })

  ALL_COMMON_DOCUMENTS.map(document => {
    if (
      COMMON_DOCUMENTS.includes(document) ||
      (COMMON_DOCUMENTS_FOR_TYPE_LISTED.includes(document) &&
        COMMON_DOCUMENTS_FOR_TYPE[docType] &&
        COMMON_DOCUMENTS_FOR_TYPE[docType].includes(document)) ||
      (COMMON_DOCUMENTS_FOR_BLOCK_LISTED.includes(document) &&
        mayNeededByBlocks.includes(document))
    ) {
      // The document it is needed
    } else {
      // It is NOT common one and it is NOT required by the current type or components from the page
      // So we remove it from final data
      delete contentRes[document]
    }

    return document
  })
}

module.exports = { removeUnnecessaryData }
