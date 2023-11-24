package com.app.projectory.dto;

import java.util.HashMap;
import java.util.Map;

public interface ProjectTaskStatusCount {
	
	
	Map<String, Integer> ProjectTaskStatusCount = new HashMap();
	public String getTaskStatusLabel();
	public int getTaskLabelCount();
}
