import * as React from 'react';

const ShowProject: React.FC<{ id: number; text: string }> = (props) => {
    const { id, text } = props;

    const link = `/project/${id}`;

    return (
        <a href={link} style={{ border: "1px solid green" }}>
            {text}
        </a>
    );
};

export default ShowProject;