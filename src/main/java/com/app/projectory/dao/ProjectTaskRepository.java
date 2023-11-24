package com.app.projectory.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.app.projectory.dto.ProjectTasksDto;
import com.app.projectory.entity.ProjectTasks;

@Repository
public interface ProjectTaskRepository extends CrudRepository<ProjectTasks, Long>{
	/* public Project findById(long projId); */
	List<ProjectTasks> findAll();
	
	@Query(value="SELECT DISTINCT pt.task_id taskId, pt.deadline, pt.status, pt.task_description taskDescription,\n"
			+ "pt.task_name taskName, pt.project_id projectId, pt.assignee assigneeId, "
			+ "us.username assigneeUsername, p.creation_date projectCreationDate\n"
			+ "	FROM project_tasks pt\n"
			+ "	LEFT JOIN project p on p.project_id = pt.project_id\n"
			+ "	LEFT JOIN project_members pm on pm.project_id = pt.project_id\n"
			+ "	LEFT JOIN users us ON us.user_id = pt.assignee\n"
			+ "	WHERE pt.project_id = ?1 \n"
			+ "	AND (pm.user_id = ?2 OR p.project_owner_user_id = ?2)", nativeQuery = true)
	List<ProjectTasksDto> findProjectTasks(long projectId, long userId);
	
	@Modifying
	@Transactional
	@Query(value="UPDATE project_tasks\n"
			+ "SET status=?2\n"
			+ "WHERE project_tasks.task_id = ?1 \n"
			+ "AND project_tasks.assignee = ?3 \n"
			+ "AND EXISTS(\n"
			+ "SELECT 1 FROM project p \n"
			+ "LEFT JOIN project_tasks pt on pt.task_id = ?1\n"
			+ "LEFT JOIN project_members pm on pm.project_id = pt.project_id\n"
			+ "WHERE (p.project_owner_user_id = ?3 AND p.project_id = pt.project_id) OR pm.user_id = ?3)", nativeQuery = true)
	int updateProjectTaskStatus(long taskId, String newStatus, long userId);
	
	
	@Modifying
	@Transactional
	@Query(value="UPDATE project_tasks\n"
			+ "SET assignee=?2\n"
			+ "WHERE project_tasks.task_id = ?1 AND EXISTS(\n"
			+ "SELECT 1 FROM project p \n"
			+ "	LEFT JOIN project_tasks pt on pt.task_id = ?1\n"
			+ "	LEFT JOIN project_members pm on pm.project_id = pt.project_id\n"
			+ "	WHERE (p.project_owner_user_id = ?3 AND p.project_id = pt.project_id) OR pm.user_id = ?3\n"
			+ ");", nativeQuery = true)
	int updateProjectTaskAssignee(long taskId, long assigneeUser, long authUserId);
	
	
	@Modifying
	@Transactional
	@Query(value="DELETE FROM project_tasks pt \n"
			+ "WHERE pt.project_id = ?1\n"
			+ "AND EXISTS(SELECT 1 FROM project p\n"
			+ "		  WHERE p.project_owner_user_id = ?2)", nativeQuery = true)
	int deleteAllTasksByProject(long projectId, long authUserId);
	
	@Modifying
	@Transactional
	@Query(value = "DELETE FROM project_tasks pt\n"
			+ "WHERE pt.task_id = ?1\n"
			+ "AND EXISTS(SELECT DISTINCT 1 FROM project p\n"
			+ "LEFT JOIN project_tasks ptj ON ptj.task_id = ?1\n"
			+ "LEFT JOIN project_members pm ON pm.project_id = ptj.project_id\n"
			+ "WHERE p.project_owner_user_id = ?2 OR pm.user_id = ?2)", nativeQuery = true)
	int deleteTask(long taskId, long authUserId);
	
	//get number of finished tasks
	@Query(value="SELECT  COUNT(status) as selectedTasks\n"
			+ "	FROM project_tasks WHERE status = ?1 AND project_id = ?2\n"
			+ "	UNION ALL\n"
			+ "	SELECT  COUNT(task_id) as allTasks\n"
			+ "	FROM project_tasks WHERE project_id = ?2", nativeQuery=true)
	int[] countProjectTasksByStatus(String statusType, long projectId);
	
	//get number of finished tasks
		@Query(value="SELECT DISTINCT 1\n"
				+ "FROM project_tasks WHERE status = ?1 "
				+ "AND project_id = ?2", nativeQuery=true)
		int[] findOneTaskByStatus(String statusType, long projectId);
		
		@Query(value="SELECT DISTINCT 1\n"
				+ "	FROM project_tasks \n"
				+ "	WHERE status = ?1\n"
				+ "	OR status = ?2\n"
				+ "	AND project_id = ?3", nativeQuery=true)
		int[] findOneTaskByTwoStatus(String statusType1, String statusType2, long projectId);
		
		@Query(value="SELECT DISTINCT 1\n"
				+ "	FROM project_tasks \n"
				+ "	WHERE status = 'not started'\n"
				+ "	OR status = 'in progress'\n"
				+ "	OR status = 'done'\n"
				+ "	AND project_id = ?1", nativeQuery=true)
		int[] findAnyOneTask(long projectId);
}
