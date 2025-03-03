import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import CreateProjectDialog from './CreateProjectDialog/CreateProjectDialog'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Notification from '../../common/Notification/Notification'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import ProjectCard from '../../elements/ProjectCard/ProjectCard'
import Search from '../../common/Search/Search'
import Sort from '../../common/Sort/Sort'
import YamlModal from '../../common/YamlModal/YamlModal'
import { ConfirmDialog, RoundedIcon } from 'igz-controls/components'

import { projectsSortOptions, projectsStates } from './projectsData'
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

import './projects.scss'

const ProjectsView = ({
  actionsMenu,
  closeNewProjectPopUp,
  confirmData,
  convertedYaml,
  convertToYaml,
  createProject,
  filterByName,
  filteredProjects,
  filterMatches,
  handleCreateProject,
  handleSelectSortOption,
  isDescendingOrder,
  isNameValid,
  projectStore,
  refreshProjects,
  removeNewProjectError,
  selectedProjectsState,
  setCreateProject,
  setFilterByName,
  setFilterMatches,
  setIsDescendingOrder,
  setNameValid,
  setNewProjectDescription,
  setNewProjectLabels,
  setNewProjectName,
  setSelectedProjectsState,
  sortProjectId,
  urlParams
}) => {
  const projectsClassNames = classnames(
    'projects',
    (createProject || convertedYaml.length > 0) && 'projects-modal_opened'
  )

  return (
    <div className={projectsClassNames}>
      {projectStore.loading && <Loader />}
      {createProject && (
        <CreateProjectDialog
          closeNewProjectPopUp={closeNewProjectPopUp}
          handleCreateProject={handleCreateProject}
          isNameValid={isNameValid}
          removeNewProjectError={removeNewProjectError}
          setNameValid={setNameValid}
          setNewProjectDescription={setNewProjectDescription}
          setNewProjectLabels={setNewProjectLabels}
          setNewProjectName={setNewProjectName}
        />
      )}
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          isOpen={confirmData}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      <div className="projects__header">
        <Breadcrumbs />
      </div>
      <div className="projects__wrapper">
        <div className="projects-content-header">
          <div className="projects-content-header__col">
            <div className="projects-content-header-item">
              <ContentMenu
                activeTab={selectedProjectsState}
                screen="active"
                tabs={projectsStates}
                onClick={setSelectedProjectsState}
              />

              <Sort
                isDescendingOrder={isDescendingOrder}
                onSelectOption={handleSelectSortOption}
                options={projectsSortOptions}
                selectedId={sortProjectId}
                setIsDescendingOrder={setIsDescendingOrder}
              />
            </div>
          </div>
          <div className="projects-content-header__col projects-content-header__col-right">
            <div className="projects-content-header-item">
              <Search
                className="projects-search"
                matches={filterMatches}
                onChange={setFilterByName}
                placeholder="Search projects..."
                setMatches={setFilterMatches}
                value={filterByName}
              />
              <PageActionsMenu
                actionsMenuHeader={'New Project'}
                onClick={() => setCreateProject(true)}
                showActionsMenu
                variant={PRIMARY_BUTTON}
              />
              <RoundedIcon
                onClick={refreshProjects}
                className="panel-title__btn_close"
                tooltipText="Refresh"
                data-testid="pop-up-close-btn"
              >
                <RefreshIcon />
              </RoundedIcon>
            </div>
          </div>
        </div>
        {projectStore.projects.length > 0 && !projectStore.error ? (
          <div className="projects-content">
            {filterByName.length > 0 &&
            (filterMatches.length === 0 || filteredProjects.length === 0) ? (
              <NoData />
            ) : selectedProjectsState === 'archived' && filteredProjects.length === 0 ? (
              <div className="no-filtered-data">No archived projects.</div>
            ) : (
              filteredProjects.map(project => {
                return (
                  <ProjectCard
                    actionsMenu={actionsMenu}
                    key={project.id || project.metadata.name}
                    project={project}
                    projectSummary={projectStore.projectsSummary.data.find(
                      item => item.name === project.metadata.name
                    )}
                  />
                )
              })
            )}
          </div>
        ) : projectStore.loading ? null : (
          <NoData message="Your projects list is empty." />
        )}
      </div>
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={convertToYaml} />
      )}
      <Notification />
    </div>
  )
}

ProjectsView.defaultProps = {
  confirmData: null
}

ProjectsView.propTypes = {
  actionsMenu: PropTypes.shape({}).isRequired,
  closeNewProjectPopUp: PropTypes.func.isRequired,
  confirmData: PropTypes.shape({}),
  convertedYaml: PropTypes.string.isRequired,
  convertToYaml: PropTypes.func.isRequired,
  createProject: PropTypes.bool.isRequired,
  filterByName: PropTypes.string.isRequired,
  filteredProjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCreateProject: PropTypes.func.isRequired,
  handleSelectSortOption: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  refreshProjects: PropTypes.func.isRequired,
  removeNewProjectError: PropTypes.func.isRequired,
  selectedProjectsState: PropTypes.string.isRequired,
  setCreateProject: PropTypes.func.isRequired,
  setFilterByName: PropTypes.func.isRequired,
  setFilterMatches: PropTypes.func.isRequired,
  setIsDescendingOrder: PropTypes.func.isRequired,
  setNewProjectDescription: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setNewProjectName: PropTypes.func.isRequired,
  setSelectedProjectsState: PropTypes.func.isRequired,
  sortProjectId: PropTypes.string.isRequired,
  urlParams: PropTypes.shape({}).isRequired
}

export default ProjectsView
