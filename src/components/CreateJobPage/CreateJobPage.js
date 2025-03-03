import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { includes, isEmpty } from 'lodash'

import CreateJobPageView from './CreateJobPageView'
import JobsPanel from '../JobsPanel/JobsPanel'

import functionsActions from '../../actions/functions'
import jobsActions from '../../actions/jobs'
import projectsAction from '../../actions/projects'
import { generateProjectsList } from '../../utils/projects'
import { PANEL_CREATE_MODE } from '../../constants'
import { isProjectValid } from '../../utils/handleRedirect'

const CreateJobPage = ({
  fetchFunctions,
  fetchFunctionsTemplates,
  fetchProjectsNames,
  functionsStore,
  projectStore,
  removeNewJob
}) => {
  const params = useParams()
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [filteredFunctions, setFilteredFunctions] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState({})
  const [functions, setFunctions] = useState([])
  const [projects, setProjects] = useState(
    generateProjectsList(
      projectStore.projectsNames.data,
      params.projectName
    )
  )
  const [selectedGroupFunctions, setSelectedGroupFunctions] = useState({})
  const [selectedProject, setSelectedProject] = useState(
    params.projectName
  )
  const [templatesCategories, setTemplatesCategories] = useState(
    functionsStore.templatesCatalog
  )
  const [templates, setTemplates] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    isProjectValid(
      navigate,
      projectStore.projectsNames.data,
      params.projectName
    )
  }, [navigate, params.projectName, projectStore.projectsNames.data])

  useEffect(() => {
    if (!selectedProject) {
      setSelectedProject(params.projectName)
    }
  }, [selectedProject, params.projectName])

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjectsNames().then(projects => {
        setProjects(generateProjectsList(projects, params.projectName))
      })
    }
  }, [fetchProjectsNames, params.projectName, projects.length])

  useEffect(() => {
    fetchFunctions(selectedProject).then(functions => {
      const filteredFunctions = functions.filter(
        func => !includes(['', 'handler', 'local'], func.kind)
      )

      const groupedFunctions = Object.values(
        filteredFunctions.reduce((prev, curr) => {
          if (!prev[curr.metadata.name]) {
            prev[curr.metadata.name] = {
              name: curr.metadata.name,
              functions: []
            }
          }

          prev[curr.metadata.name].functions.push(curr)

          return prev
        }, {})
      )

      return setFunctions(groupedFunctions)
    })

    if (isEmpty(functionsStore.templatesCatalog)) {
      fetchFunctionsTemplates().then(templatesObject => {
        setTemplatesCategories(templatesObject.templatesCategories)
        setTemplates(templatesObject.templates)
      })
    }
  }, [
    fetchFunctions,
    fetchFunctionsTemplates,
    functionsStore.templatesCatalog,
    params.projectName,
    selectedProject
  ])

  useEffect(() => {
    if (filterByName.length > 0) {
      const filteredFuncs = functions.filter(func =>
        func.name.includes(filterByName)
      )
      const filteredTemplts = templates.filter(template =>
        template.metadata.name.includes(filterByName)
      )
      const filteredTemplatesCategories = {}

      Object.entries(templatesCategories).forEach(([key, value]) => {
        filteredTemplatesCategories[key] = value.filter(template =>
          template.metadata.name.includes(filterByName)
        )
      })

      setFilteredFunctions(filteredFuncs)
      setFilteredTemplates(filteredTemplatesCategories)
      setFilterMatches([
        ...new Set(
          filteredFuncs
            .map(func => func.name)
            .concat(filteredTemplts.map(template => template.metadata.name))
        )
      ])
    }
  }, [filterByName, functions, templates, templatesCategories])

  const handleSelectGroupFunctions = item => {
    setSelectedGroupFunctions(item)
    setShowPanel(true)
  }

  const selectProject = projectName => {
    setSelectedProject(projectName)

    if (filterByName.length > 0) {
      setFilterByName('')
    }
  }

  const handleSearchOnChange = value => {
    if (value.length === 0) {
      setFilterByName('')
      setFilterMatches([])

      if (filteredFunctions.length > 0) {
        setFilteredFunctions([])
      }

      if (!isEmpty(filteredTemplates)) {
        setFilteredTemplates({})
      }
    } else {
      setFilterByName(value)
    }
  }

  return (
    <>
      <CreateJobPageView
        filterByName={filterByName}
        filterMatches={filterMatches}
        filteredFunctions={filteredFunctions}
        filteredTemplates={filteredTemplates}
        functions={filteredFunctions.length > 0 ? filteredFunctions : functions}
        handleSearchOnChange={handleSearchOnChange}
        handleSelectGroupFunctions={handleSelectGroupFunctions}
        loading={functionsStore.loading}
        params={params}
        projects={projects}
        selectProject={selectProject}
        selectedProject={selectedProject}
        setFilterMatches={setFilterMatches}
        templates={
          !isEmpty(filteredTemplates) ? filteredTemplates : templatesCategories
        }
      />
      {showPanel && (
        <JobsPanel
          closePanel={() => {
            setShowPanel(false)
            removeNewJob()
          }}
          groupedFunctions={selectedGroupFunctions}
          mode={PANEL_CREATE_MODE}
          project={selectedProject}
        />
      )}
    </>
  )
}

export default connect(
  ({ functionsStore, projectStore }) => ({ functionsStore, projectStore }),
  {
    ...functionsActions,
    ...jobsActions,
    ...projectsAction
  }
)(CreateJobPage)
