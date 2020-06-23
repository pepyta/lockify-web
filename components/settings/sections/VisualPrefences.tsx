import React from 'react';
import Section from '../Section';
import { User } from '../../../modules/api';
import useDarkMode from 'use-dark-mode';

export default function VisualPrefences(props:{
    user: User,
    onSectionMounted: (id: string) => void,
    id: string,
    position: number
}){
    const M = require('materialize-css');
    props.onSectionMounted(props.id);

    let darkMode = useDarkMode(false);

    return (
        <Section
            position={props.position}
            id="visual-prefences"
            title="Visual prefences">
                <label>
                    <input id="dark-mode" type="checkbox" checked={darkMode.value} onClick={darkMode.toggle} />
                    <span>Dark mode</span>
                </label>
        </Section>
    );

}