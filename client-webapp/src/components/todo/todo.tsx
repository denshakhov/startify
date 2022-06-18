import { Component, createRef } from 'react'
import { TodoForm } from '../todo-form/todo-form'
import { TodoList } from '../todo-list/todo-list'
import { ITodoTask } from './todo-tasks-repository'
import './todo.css'

export class Todo extends Component {
    private formRef = createRef<TodoForm>()
    private listRef = createRef<TodoList>()

    private onListLoadedHandler = () => {
        this.formRef.current?.setState({ disabled: false })
    }

    private onCreateHandler = (item: ITodoTask) => {
        this.listRef.current?.addTask(item)
    }

    public override render() {
        return (
            <div className="todo">
                <header className="todo-logo">Todoify</header>
                <TodoForm ref={this.formRef} disabled placeholder="What needs to be done?" onSubmitted={this.onCreateHandler} />
                <TodoList ref={this.listRef} onLoaded={this.onListLoadedHandler} />
            </div>
        )
    }
}
