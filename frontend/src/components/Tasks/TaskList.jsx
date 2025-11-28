import React from 'react';
import TaskCard from './TaskCard';
import Loading from '../Common/Loading';

const TaskList = ({ tasks, loading, projectMembers }) => {
  if (loading) {
    return <Loading />;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm mt-2">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} projectMembers={projectMembers} />
      ))}
    </div>
  );
};

export default TaskList;