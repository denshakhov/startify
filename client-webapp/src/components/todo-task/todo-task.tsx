import { ChangeEvent, Component } from 'react'
import { TodoForm } from '../todo-form/todo-form'
import { todoTasksRepository, ITodoTask } from '../todo/todo-tasks-repository'
import './todo-task.css'
import '../checkbox/checkbox.css'
import { showFetchError } from '../../utils'
import { Button } from '../button/button'
import { ReactComponent as EditIcon } from '../../icons/edit.svg'
import { ReactComponent as TrashIcon } from '../../icons/trash.svg'

export interface ITodoTaskProps {
    task: ITodoTask
    onDeleted(id: ITodoTask['id']): void
    onEdit?(sender: TodoTask): void
}

export interface ITodoTaskState {
    title: string
    completed: boolean
    loading: boolean
    editing: boolean
}

export class TodoTask extends Component<ITodoTaskProps, ITodoTaskState> {
    public override state: ITodoTaskState = {
        title: this.props.task.title,
        completed: this.props.task.completed,

        loading: false,
        editing: false,
    }

    private onEditClickHandler = () => {
        this.props.onEdit?.(this)
        this.setState({ editing: true })
    }

    private onCancelHandler = () => {
        this.closeEditForm()
    }

    private onDeleteClickHandler = () => {
        void this.deleteTask()
    }

    private onCompletedHandler = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ completed: event.target.checked }, () => {
            void this.updateCompleted()
        })
    }

    private onSubmitHandler = () => {
        this.setState({ loading: true })
    }

    private onSubmittedHandler = (task: ITodoTask) => {
        this.setState({
            loading: false,
            editing: false,
            title: task.title,
        })
    }

    public closeEditForm() {
        if (!this.state.loading) {
            this.setState({ editing: false })
        }
    }

    private async deleteTask() {
        try {
            this.setState({ loading: true })
            await todoTasksRepository.delete({ id: this.props.task.id })
            this.props.onDeleted(this.props.task.id)
        } catch (error) {
            showFetchError(error)
        } finally {
            this.setState({ loading: false })
        }
    }

    private async updateCompleted() {
        try {
            this.setState({ loading: true })
            await todoTasksRepository.updateCompleted({
                id: this.props.task.id,
                completed: this.state.completed,
            })
        } catch (error) {
            showFetchError(error)
        } finally {
            this.setState({ loading: false })
        }
    }

    public override render() {
        const { loading, title, completed, editing } = this.state
        const className = `todo-task ${completed ? 'todo-task--completed' : ''} ${editing ? 'todo-task--editing' : ''}`

        if (editing) {
            return (
                <li className={className}>
                    <TodoForm id={this.props.task.id} title={title} onSubmit={this.onSubmitHandler} onSubmitted={this.onSubmittedHandler} onCancel={this.onCancelHandler} />
                </li>
            )
        }

        return (
            <li className={className}>
                <label className="todo-task__label">
                    <div className="checkbox">
                        <input type="checkbox" disabled={loading} checked={completed} onChange={this.onCompletedHandler} />
                        <div className="checkbox-input"></div>
                    </div>
                    <span className="todo-task__text">{title}</span>
                </label>

                <div className="todo-task__buttons">
                    <Button type="button" color="transparent" onClick={this.onEditClickHandler} disabled={loading} icon={<EditIcon />} />
                    <Button type="button" color="transparent" onClick={this.onDeleteClickHandler} disabled={loading} icon={<TrashIcon />} />
                </div>
            </li>
        )
    }
}
