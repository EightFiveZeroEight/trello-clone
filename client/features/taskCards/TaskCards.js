import React from 'react';
import { Link } from 'react-router-dom';

const TaskCards = (props) => {
  return (
    <Link>
      <p>{props.taskCard.taskcardName}</p>
    </Link>
  )
}

export default TaskCards;