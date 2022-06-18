import { ChangeEvent, Component, createRef, FormEvent } from 'react'
import { todoTasksRepository, ITodoTask } from '../todo/todo-tasks-repository'
import { showFetchError } from '../../utils'
import './todo-form.css'
import { Button } from '../button/button'
import { ReactComponent as CloseIcon } from '../../icons/close.svg'
import { ReactComponent as SaveIcon } from '../../icons/floppy-disc.svg'
import { ReactComponent as AddIcon } from '../../icons/plus.svg'

export interface ITodoFormProps {
    id?: string
    title?: string
    disabled?: boolean
    placeholder?: string
    onSubmitted(task: ITodoTask): void
    onSubmit?(): void
    onCancel?(): void
}

export interface ITodoFormState {
    title: string
    disabled: boolean
    submitting: boolean
}

export class TodoForm extends Component<ITodoFormProps, ITodoFormState> {
    private inputTitleRef = createRef<HTMLInputElement>()
    private editing = this.props.id !== undefined

    public override state: ITodoFormState = {
        title: this.props.title ?? '',
        disabled: this.props.disabled ?? false,
        submitting: false,
    }

    public override componentDidMount() {
        this.inputTitleRef.current?.focus()
    }

    private onSubmitHandler = (event: FormEvent) => {
        event.preventDefault()
        void this.submit()
    }

    private onInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name as 'title']: event.target.value })
    }

    private async submit() {
        if (this.state.title.trim() === '') return

        try {
            this.props.onSubmit?.()
            this.setState({ submitting: true, disabled: true })

            const response = !this.editing
                ? await todoTasksRepository.create({
                      title: this.state.title,
                  })
                : await todoTasksRepository.update({
                      id: this.props.id,
                      title: this.state.title,
                  })

            this.props.onSubmitted(response)
            this.setState({ title: '' })
        } catch (error) {
            this.props.onCancel?.()
            showFetchError(error)
        } finally {
            this.setState({ submitting: false, disabled: false })
        }
    }

    public override render() {
        const formDisabled = this.state.submitting || this.state.disabled

        return (
            <form onSubmit={this.onSubmitHandler} className={`todo-form ${this.editing ? 'todo-form--editing' : ''}`}>
                <input
                    type="text"
                    name="title"
                    ref={this.inputTitleRef}
                    placeholder={this.props.placeholder ?? ''}
                    minLength={1}
                    maxLength={200}
                    value={this.state.title}
                    disabled={formDisabled}
                    required
                    onChange={this.onInputChangeHandler}
                />

                <Button loading={this.state.submitting} disabled={formDisabled} color="primary" icon={this.editing ? <SaveIcon /> : <AddIcon />} />
                {this.editing ? <Button type="button" disabled={formDisabled} onClick={this.props.onCancel} icon={<CloseIcon />} /> : null}
            </form>
        )
    }
}
