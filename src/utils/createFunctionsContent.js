import { formatDatetime } from './datetime'
import { getFunctionIdentifier } from './getUniqueIdentifier'
import { FUNCTIONS_PAGE, REAL_TIME_PIPELINES_TAB } from '../constants'
import { page } from '../components/Models/models.util'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'

const createFunctionsContent = (functions, isSelectedItem, params) =>
  functions.map(func => {
    const identifierUnique = getFunctionIdentifier(func, true)

    return params.pageTab === REAL_TIME_PIPELINES_TAB
      ? {
          name: {
            id: `name.${identifierUnique}`,
            value: func.name,
            class: 'functions_medium',
            identifier: getFunctionIdentifier(func),
            identifierUnique: getFunctionIdentifier(func, true),
            getLink: hash => {
              return `/projects/${params.projectName}/${page.toLowerCase()}/${
                params.pageTab
              }/pipeline/${hash}`
            },
            showTag: true,
            showStatus: true
          },
          kind: {
            id: `kind.${identifierUnique}`,
            value: func.graph?.kind === 'router' ? 'Router' : 'Flow',
            class: 'functions_medium',
            type: 'type'
          },
          function: {
            id: `function.${identifierUnique}`,
            value: func.name,
            class: 'functions_big',
            getLink: tab =>
              generateLinkToDetailsPanel(
                func.project,
                FUNCTIONS_PAGE,
                null,
                func.hash,
                null,
                tab
              )
          },
          updated: {
            id: `updated.${identifierUnique}`,
            value: formatDatetime(new Date(func.updated), 'N/A'),
            class: 'functions_medium',
            type: 'date',
            showTag: true,
            showStatus: true,
            hidden: true
          }
        }
      : {
          name: {
            id: `name.${identifierUnique}`,
            value: func.name,
            class: 'functions_medium',
            showTag: true,
            showStatus: true,
            identifier: getFunctionIdentifier(func),
            identifierUnique: identifierUnique
          },
          kind: {
            id: `kind.${identifierUnique}`,
            value: func.type,
            class: 'functions_small',
            type: 'type',
            hidden: isSelectedItem
          },
          hash: {
            id: `hash.${identifierUnique}`,
            value: func.hash,
            class: 'functions_small',
            type: 'hash',
            hidden: isSelectedItem
          },
          updated: {
            id: `updated.${identifierUnique}`,
            value: formatDatetime(new Date(func.updated), 'N/A'),
            class: 'functions_small',
            type: 'date',
            showTag: true,
            showStatus: true,
            hidden: isSelectedItem
          },
          command: {
            id: `command.${identifierUnique}`,
            value: func.command,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          image: {
            id: `image.${identifierUnique}`,
            value: func.image,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          description: {
            id: `description.${identifierUnique}`,
            value: func.description,
            class: 'functions_small',
            hidden: isSelectedItem
          },
          tag: {
            id: `tag.${identifierUnique}`,
            value: func.tag,
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
  })

export default createFunctionsContent
