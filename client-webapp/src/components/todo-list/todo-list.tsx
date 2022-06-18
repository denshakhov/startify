import { Component } from 'react'
import { TodoTask } from '../todo-task/todo-task'
import { Spinner } from '../spinner/spinner'
import { todoTasksRepository, ITodoTask } from '../todo/todo-tasks-repository'
import listImage from '../../icons/list.svg'
import { showFetchError } from '../../utils'
import './todo-list.css'

export interface ITodoListProps {
    onLoaded(): void
}

export interface ITodoListState {
    loading: boolean
    tasks: ITodoTask[]
}

export class TodoList extends Component<ITodoListProps, ITodoListState> {
    public override state: ITodoListState = {
        loading: false,
        tasks: [],
    }

    private currentEditedTask?: TodoTask

    public override componentDidMount() {
        void this.getTasks()
    }

    private onEditHandler = (sender: TodoTask) => {
        this.currentEditedTask?.closeEditForm()
        this.currentEditedTask = sender
    }

    public addTask(task: ITodoTask) {
        this.setState({ tasks: [task, ...this.state.tasks] })
    }

    private deleteTask = (id: ITodoTask['id']) => {
        this.setState({ tasks: this.state.tasks.filter(item => item.id !== id) })
    }

    private async getTasks() {
        try {
            this.setState({ loading: true })
            this.setState({ tasks: await todoTasksRepository.getAll() })
        } catch (error) {
            showFetchError(error)
        } finally {
            this.props.onLoaded()
            this.setState({ loading: false })
        }
    }

    public override render() {
        if (this.state.loading) {
            return (
                <div className="todo-empty">
                    <Spinner />
                    <div>Loading...</div>
                </div>
            )
        }

        if (!this.state.tasks.length) {
            return (
                <div className="todo-empty">
                    <img src={listImage} alt="Empty List" />
                    <div>Nothing to do...</div>
                </div>
            )
        }

        return (
            <ul className="todo-list">
                {this.state.tasks.map(item => (
                    <TodoTask key={item.id} task={item} onDeleted={this.deleteTask} onEdit={this.onEditHandler} />
                ))}
            </ul>
        )
    }
}
