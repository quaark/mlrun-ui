import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useParams } from 'react-router-dom'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import { getFunctionIdentifier } from '../../utils/getUniqueIdentifier'
import { detailsMenu } from '../../components/FunctionsPage/functions.util'
import { ACTIONS_MENU } from '../../types'

const FunctionsTableRow = ({
  actionsMenu,
  content,
  handleExpandRow,
  handleSelectItem,
  rowItem,
  selectedItem,
  tableContent
}) => {
  const [currentItem, setCurrentItem] = useState(null)
  const parent = useRef()
  const params = useParams()
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    getFunctionIdentifier(selectedItem, true) === rowItem.name?.identifierUnique &&
      !parent.current?.classList.value.includes('parent-row-expanded') &&
      'row_active',
    parent.current?.classList.value.includes('parent-row-expanded') && 'parent-row-expanded'
  )

  const findCurrentItem = useCallback(
    rowItem => {
      return content.find(
        contentItem => getFunctionIdentifier(contentItem, true) === rowItem.name?.identifierUnique
      )
    },
    [content]
  )

  useEffect(() => {
    setCurrentItem(findCurrentItem(rowItem))
  }, [findCurrentItem, rowItem])

  return (
    <div className={rowClassNames} ref={parent}>
      {parent.current?.classList.contains('parent-row-expanded') ? (
        <div className="row_grouped-by">
          <div className="table-body__row">
            <TableCell
              data={rowItem.name}
              firstCell
              handleExpandRow={handleExpandRow}
              item={rowItem}
              selectItem={handleSelectItem}
              selectedItem={selectedItem}
              showExpandButton
            />
          </div>
          <>
            {tableContent.map((func, index) => {
              const subRowCurrentItem =
                content.length > 0 &&
                content.find(item => {
                  return getFunctionIdentifier(item, true) === func.name.identifierUnique
                })
              const isActiveSubRow =
                getFunctionIdentifier(selectedItem, true) === func.name.identifierUnique

              return (
                <div className={`table-body__row ${isActiveSubRow && 'row_active'}`} key={index}>
                  {Object.values(func).map((value, i) => {
                    const funcUpdated = { ...func.updated, class: 'functions_medium' }

                    return (
                      !value.hidden && (
                        <TableCell
                          data={i === 0 && func.updated ? funcUpdated : value}
                          item={subRowCurrentItem}
                          link={
                            value.getLink
                              ? value.getLink(currentItem?.hash)
                              : i === 0 &&
                                `/projects/${params.projectName}/functions/${
                                  subRowCurrentItem?.hash
                                }${params.tab ? `/${params.tab}` : `/${detailsMenu[0].id}`}`
                          }
                          key={value.id}
                          selectItem={handleSelectItem}
                          selectedItem={selectedItem}
                        />
                      )
                    )
                  })}
                  <div className="table-body__cell action_cell">
                    <ActionsMenu dataItem={subRowCurrentItem} menu={actionsMenu} />
                  </div>
                </div>
              )
            })}
          </>
        </div>
      ) : (
        <>
          {Object.values(rowItem).map((rowItemProp, i) => {
            return (
              currentItem &&
              !rowItemProp.hidden && (
                <TableCell
                  data={rowItemProp}
                  firstCell={i === 0}
                  handleExpandRow={handleExpandRow}
                  item={currentItem}
                  key={rowItemProp.id}
                  link={
                    rowItemProp.getLink
                      ? rowItemProp.getLink(currentItem?.hash)
                      : i === 0 &&
                        `/projects/${params.projectName}/functions/${
                          content.length > 0 && currentItem?.hash
                        }/${params.tab ? params.tab : `${detailsMenu[0].id}`}`
                  }
                  selectedItem={selectedItem}
                  selectItem={handleSelectItem}
                  showExpandButton={Array.isArray(tableContent)}
                />
              )
            )
          })}
          <div className="table-body__cell action_cell">
            <ActionsMenu dataItem={currentItem} menu={actionsMenu} />
          </div>
        </>
      )}
    </div>
  )
}

FunctionsTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default FunctionsTableRow
