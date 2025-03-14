import * as React from 'react';

const ShowProject: React.FC<{ id: number; text: string }> = (props) => {
    const { id, text } = props;

    const link = `/project/${id}`;

    return (
        <a href={link} style={{ border: "1px solid green" }} title={text}>
            {text}
        </a>
    );
};

export default ShowProject;
