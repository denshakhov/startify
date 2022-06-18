import { Component } from 'react'
import './spinner.css'

export class Spinner extends Component {
    public override render() {
        return (
            <svg viewBox="0 0 24 24" className="spinner">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeLinecap="round" strokeWidth="3" fill="none" className="spinner-circle" />
            </svg>
        )
    }
}
