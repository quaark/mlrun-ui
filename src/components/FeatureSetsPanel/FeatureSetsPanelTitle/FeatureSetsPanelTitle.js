import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeatureSetsPanelTitleView from './FeatureSetsPanelTitleView'

import featureStoreActions from '../../../actions/featureStore'

const FeatureSetsPanelTitle = ({
  featureStore,
  closePanel,
  setNewFeatureSetDescription,
  setNewFeatureSetLabels,
  setNewFeatureSetName,
  setNewFeatureSetVersion,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    version: '',
    labels: []
  })

  const handleNameOnBlur = () => {
    if (data.name !== featureStore.newFeatureSet.metadata.name) {
      setNewFeatureSetName(data.name)
    }
  }

  const handleAddLabel = (label, labels) => {
    const newLabels = {}
    const labelsArray = [...labels, label]

    labelsArray.forEach(
      label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    setNewFeatureSetLabels(newLabels)
    setData(state => ({
      ...state,
      labels: [...labels, label]
    }))
  }

  const handleChangeLabels = labels => {
    const newLabels = {}

    labels.forEach(
      label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    setNewFeatureSetLabels(newLabels)
    setData(state => ({
      ...state,
      labels
    }))
  }

  return (
    <FeatureSetsPanelTitleView
      closePanel={closePanel}
      data={data}
      featureStore={featureStore}
      handleAddLabel={handleAddLabel}
      handleChangeLabels={handleChangeLabels}
      handleNameOnBlur={handleNameOnBlur}
      setData={setData}
      setNewFeatureSetDescription={setNewFeatureSetDescription}
      setNewFeatureSetVersion={setNewFeatureSetVersion}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FeatureSetsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(FeatureSetsPanelTitle)
