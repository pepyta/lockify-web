import React from 'react';

export default class SaveButton extends React.Component<{
    classes?: string,
    disabled: boolean
}> {
    render(){
        return (
            <button disabled={this.props.disabled} className={`btn waves-effect waves-light black ${this.props.classes}`}>
                Save
            </button>
        );
    }
}