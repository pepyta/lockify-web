import React from 'react';

export default class TabLink extends React.Component<{
    onClick: () => void,
    active: boolean
}> {
    render() {
        return (
            <a href="#" onClick={(e) => {
                e.preventDefault();
                this.props.onClick();
            }}>
                <div className="tablink left col" style={{
                    color: this.props.active ? "#000" : null
                }}>
                    {this.props.children}
                </div>
            </a>
        )
    }
}