import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskCard,
  deleteThisTaskCard,
  deleteThisList,
  addTaskCardSocket
} from "../singleBoard/singleBoardSlice";
import SingleTaskCard from "../taskCards/SingleTaskCard";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import io from "socket.io-client";

const socket = io();

const ListContainer = styled.div``;

const SingleList = (props) => {
  const { boardId, list } = props;
  const userId = useSelector((state) => state.auth.me.id);
  const listId = list.id;
  const numTaskCards = list.taskcards ? list.taskcards.length + 1 : 1;

  const dispatch = useDispatch();

  const [taskCardTitle, setTaskCardTitle] = useState("");

  useEffect(() => {
    socket.off("add-taskCard").on("add-taskCard", (newTaskCard) => {
      dispatch(addTaskCardSocket(newTaskCard));
    });
  }, [dispatch]);

  const handleSubmitTaskCard = async (evt) => {
    evt.preventDefault();
    if (taskCardTitle.length) {
      const newTaskCard = await dispatch(
        addTaskCard({
          boardId,
          listId,
          title: taskCardTitle,
          position: numTaskCards,
        })
      );
      socket.emit("add-taskCard", newTaskCard.payload);
      setTaskCardTitle("");
    }
  };

  const handleDeleteList = async (evt) => {
    console.log(
      `***
    ***
    ***
    Logging:handleDeleteList
    ***
    ***
    ***
    `,
      evt
    );
    await dispatch(deleteThisList({ listId, userId, boardId }));
  };

  const handleDeleteSingleTaskCard = async (evt) => {
    console.log(
      `***
    ***
    ***
    Logging:handleDelete
    ***
    ***
    ***
    `,
      evt
    );
    const deleteTaskCard = await dispatch(
      deleteThisTaskCard({
        taskCardId: evt,
        userId: userId,
        boardId: boardId,
      })
    );
    console.log(deleteTaskCard);
  };

  return (
    <div className="list-container-content">
      <button
          onClick={() => handleDeleteList(list.id)}
        style={{ float: "right" }}
        >
        X
      </button>
      <h4>{list.listName}</h4>
      <Droppable droppableId={listId.toString()}>
        {(provided) => (
          <ListContainer
            // className='list-container-content'
            innerRef={provided.innerRef}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.taskcards && list.taskcards.length
              ? list.taskcards.map((taskCard, index) => (
                  <div key={`taskCard#${taskCard.id}`} className="taskCard">
                    <SingleTaskCard
                      list={list}
                      taskCard={taskCard}
                      index={index}
                    />
                  </div>
                ))
              : null}
            {provided.placeholder}
          </ListContainer>
        )}
      </Droppable>
      <div className="list-bottom-container">
        <form className="add-taskCard-form" onSubmit={handleSubmitTaskCard}>
          <input
            className="add-taskCard"
            name="title"
            type="text"
            value={taskCardTitle}
            onChange={(evt) => setTaskCardTitle(evt.target.value)}
          />
          <button className="add-taskCard-button" type="submit">
            Add card
          </button>
        </form>
      </div>
    </Box>
  );
};

export default SingleList;
