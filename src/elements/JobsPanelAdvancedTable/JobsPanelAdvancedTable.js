import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../../common/Input/Input'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import Select from '../../common/Select/Select'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { selectOptions } from '../../components/JobsPanelAdvanced/jobsPanelAdvanced.util'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'

export const JobsPanelAdvancedTable = ({
  addNewItem,
  className,
  content,
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handleResetForm,
  headers,
  isPanelEditMode,
  newName,
  section,
  selectedId,
  selectedItem,
  setAddNewItem,
  setNewItemName,
  setNewItemValue,
  setSelectedItem,
  setValidation,
  validation
}) => {
  const addBtnClassNames = classnames('add-new-item-btn', isPanelEditMode && 'disabled')

  return (
    <JobsPanelTable
      addNewItem={addNewItem}
      className={className}
      content={content}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      headers={headers}
      section={section}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      setValidation={setValidation}
      validation={validation}
    >
      {addNewItem && !isPanelEditMode ? (
        <div className="table__row-add-item">
          <div className="input-row-wrapper">
            {section.includes('secrets') ? (
              <Select
                density="medium"
                onClick={setNewItemName}
                label={selectedId.length ? selectedId : 'Kind'}
                options={selectOptions.secretKind}
              />
            ) : (
              <Input
                className="input-row__item"
                density="medium"
                floatingLabel
                invalid={isNameNotUnique(newName, content) || !validation.envVariablesName}
                invalidText={
                  isNameNotUnique(newName, content)
                    ? 'Name already exists'
                    : 'This field is invalid'
                }
                label="Name"
                onChange={setNewItemName}
                required
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    envVariablesName: value
                  }))
                }
                type="text"
              />
            )}
            <Input
              className="input-row__item input-row__item_edit"
              density="medium"
              floatingLabel
              invalid={!validation.secretsSourceValue}
              label="Value"
              onChange={setNewItemValue}
              required
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  secretsSourceValue: value
                }))
              }
              type="text"
            />
          </div>
          <button
            className={addBtnClassNames}
            disabled={isNameNotUnique(newName, content) || isPanelEditMode}
            onClick={handleAddNewItem}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
          <button disabled={isPanelEditMode} onClick={handleResetForm}>
            <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
              <Delete />
            </Tooltip>
          </button>
        </div>
      ) : (
        <JobsPanelTableAddItemRow
          isPanelEditMode={isPanelEditMode}
          onClick={setAddNewItem}
          text="secret"
        />
      )}
    </JobsPanelTable>
  )
}

JobsPanelAdvancedTable.defaultProps = {
  className: '',
  newName: '',
  selectedId: ''
}

JobsPanelAdvancedTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape).isRequired,
  isPanelEditMode: PropTypes.bool.isRequired,
  newName: PropTypes.string,
  section: PropTypes.string.isRequired,
  selectedId: PropTypes.string,
  selectedItem: PropTypes.shape({}).isRequired,
  setAddNewItem: PropTypes.func.isRequired,
  setNewItemName: PropTypes.func.isRequired,
  setNewItemValue: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}
