package com.app.projectory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.app.projectory.dao.ProjectRepository;
import com.app.projectory.dao.ProjectTaskRepository;
import com.app.projectory.dto.ProjectTasksDto;
import com.app.projectory.entity.Project;

@Service
public class ProjectService {

	@Autowired
	ProjectRepository projDao;
	@Autowired
	ProjectTaskRepository taskRepo;
	@Autowired
	userAccountService userServ;

	public List<Project> getProjectForCurrentUser(Long userId) {
		List<Project> fetchedProjects = projDao.findProjectListByUser(userId);
		return fetchedProjects;
	}

	public int updateProjectStatus(long projectId, Authentication auth) {
		// check number of finished task
		//int[] statusCount = taskRepo.findOneTaskByStatus(taskStatus, projectId);
		boolean projectIsDone = true;
		boolean projectInProgress = false;
		long userId = userServ.getUserId(auth);
		List<ProjectTasksDto> tasks = taskRepo.findProjectTasks(projectId, userId);
		
		if(tasks.size() == 0) {
			updateProjectStatusOnDb(0, projectId); //set project to Not started			
			return 1;
		}
		else {
			for(ProjectTasksDto task : tasks) {
				if(!task.getStatus().equals("done")) {
					projectIsDone = false;
				}
				if(task.getStatus().equals("in progress") || task.getStatus().equals("done")) {
					projectInProgress = true;
				}
			}
			
			if(projectIsDone) {
				updateProjectStatusOnDb(2, projectId); // 2 means project completed
			}
			else if(projectInProgress) {
				updateProjectStatusOnDb(1, projectId); // 1 means project In Progress
			}
			else if(!projectIsDone && !projectInProgress) {
				updateProjectStatusOnDb(0, projectId); //set project to Not started				
			}
			return 1;
		}
		
		
//		else {
//			//if (taskRepo.findOneTaskByStatus("in progress", projectId).length != 0) {
//			if (taskRepo.findOneTaskByStatus("in progress", projectId).length != 0) {
//				//1 task in progress == project In Progress
//				// if Project status is completed, change to In Progress(if new task added/task reverted back)
//				//if (statusCount[0] == statusCount[1])  //checking before updating to be added later(for calls to db cost reasons)
//					updateProjectStatusOnDb(1, projectId); // 1 means project In Progress
//			}
//			else {
//				if(taskRepo.findOneTaskByTwoStatus("in progress", "done", projectId).length != 0) {
//					updateProjectStatusOnDb(0, projectId); //set project to Not started
//				}
//				if (taskRepo.findOneTaskByTwoStatus("in progress", "not started", projectId).length != 0) {			
//					// if all tasks done/ all unfinished tasks deleted
//					updateProjectStatusOnDb(2, projectId); // 2 means project completed
//				}
//			}
//		}
		
		
		//return 0;
	}

	public int updateProjectStatusOnDb(int status, long projectId) {
		String[] statusList = { "Not started", "In Progress", "Completed", "On Hold" };
		return projDao.updateProjectStatus(statusList[status], projectId);
	}

}
