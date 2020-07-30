import React from "react"
import uuid from "uuid/v4"
import { useImmerReducer } from "use-immer"

// Asserts on undefined, false, -1, null.
function assert(value) {
	if (value !== undefined && value !== false && value !== -1 && value !== null) {
		return
	}
	throw new Error(`assert: value assertion; value=${value}`)
}

const initialState = {
	todo: {
		done: false,
		text: "",
	},
	todos: [],
}

// Toggles the next todo.
function toggleNextTodo(state) {
	state.todo.done = !state.todo.done
}

// Updates the next todo.
function updateNextTodo(state, text) {
	state.todo.text = text
}

/// Append the next todo (appends to the start).
function appendNextTodo(state) {
	// if (!state.todo.text) {
	// 	return
	// }
	state.todos.unshift({
		id: uuid(),
		...state.todo,
	})
	state.todo.text = ""
}

// Toggles an todo based on an ID.
function toggleTodoByID(state, id) {
	const todo = state.todos.find(each => each.id === id)
	assert(todo)
	todo.done = !todo.done
}

// Updates an todo based on an ID.
function updateTodoByID(state, id, text) {
	const todo = state.todos.find(each => each.id === id)
	assert(todo)
	todo.text = text
}

// Deletes an todo based on an ID.
function deleteTodoByID(state, id) {
	const x = state.todos.findIndex(each => each.id === id)
	assert(x)
	state.todos.splice(x, 1)
}

function TodoAppReducer(state, action) {
	switch (action.type) {
	case "TOGGLE_NEXT_TODO":
		return void toggleNextTodo(state)
	case "UPDATE_NEXT_TODO":
		return void updateNextTodo(state, action.text)
	case "APPEND_NEXT_TODO":
		return void appendNextTodo(state)
	case "TOGGLE_TODO_BY_ID":
		return void toggleTodoByID(state, action.id)
	case "UPDATE_TODO_BY_ID":
		return void updateTodoByID(state, action.id, action.text)
	case "DELETE_TODO_BY_ID":
		return void deleteTodoByID(state, action.id)
	default:
		throw new Error(`TodoAppReducer: action mismatch; action=${action}`)
	}
}

const TodoApp = () => {
	const [state, dispatch] = useImmerReducer(TodoAppReducer, {}, () => initialState)
	return (
		<div>

			<form onSubmit={e => {
				e.preventDefault()
				dispatch({
					type: "APPEND_NEXT_TODO",
				})
			}}>
				<input
					type="checkbox"
					checked={state.todo.done}
					onChange={e => {
						dispatch({
							type: "TOGGLE_NEXT_TODO",
						})
					}}
				/>
				<input
					type="text"
					value={state.todo.text}
					onChange={e => {
						dispatch({
							type: "UPDATE_NEXT_TODO",
							text: e.target.value,
						})
					}}
				/>
				<button type="submit" disabled={!state.todo.text}>
					Add
				</button>
			</form>

			{state.todos.map(each => (
				<div id={each.id}>
					<input
						type="checkbox"
						checked={each.done}
						onChange={e => {
							dispatch({
								type: "TOGGLE_TODO_BY_ID",
								id: each.id,
							})
						}}
					/>
					<input
						type="text"
						value={each.text}
						onChange={e => {
							dispatch({
								type: "UPDATE_TODO_BY_ID",
								id: each.id,
								text: e.target.value,
							})
						}}
					/>
					<button
						onClick={e => {
							dispatch({
								type: "DELETE_TODO_BY_ID",
								id: each.id,
							})
						}}
					>
						Delete
					</button>
				</div>

			))}

			{/* Debugger */}
			{/* <pre style={{ tabSize: 2 }}> */}
			{/* 	{JSON.stringify(state, null, "\t")} */}
			{/* </pre> */}

		</div>
	)
}

export default TodoApp
