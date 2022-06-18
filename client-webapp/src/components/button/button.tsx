import { Component } from 'react'
import { Spinner } from '../spinner/spinner'
import './button.css'

export interface IButtonProps {
    type?: 'submit' | 'button' | 'reset'
    color?: 'default' | 'primary' | 'transparent'
    size?: 'default' | 'small' | 'large'
    icon?: any
    loading?: boolean
    disabled?: boolean
    text?: string
    onClick?(): void
}

export class Button extends Component<IButtonProps> {
    public override render() {
        return (
            <button
                type={this.props.type ?? 'submit'}
                className={`button ${this.props.loading ? 'button--loading' : ''} button--${this.props.color ?? 'default'} button--${this.props.size ?? 'default'}`}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                {typeof this.props.icon === 'string' ? null : this.props.icon}
                {this.props.text ? <span className="button__text">{this.props.text}</span> : null}
                <Spinner />
            </button>
        )
    }
}
