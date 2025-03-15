import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { LOG_SOURCE_BASE } from '../../../../constants';

const LOG_SOURCE: string = LOG_SOURCE_BASE + ':TaskCommandBar:';

export type TaskCommandBarEvents = | "refresh" | "new";

export type TaskCommandBarProps = {
    onCommand(event: TaskCommandBarEvents): Promise<void>;
}

const TaskCommandBar: React.FC<TaskCommandBarProps> = (props) => {
    const { onCommand } = props;

    const onCommandInternal = (event: TaskCommandBarEvents): void => {
        console.debug(`${LOG_SOURCE} onCommand`, event);
        onCommand(event)
            .then(() => console.debug(`${LOG_SOURCE} onCommand`, event, 'completed'))
            .catch(e => console.error(`${LOG_SOURCE} onCommand`, event, e));
    }    

    const barItems: ICommandBarItemProps[] = [
        {
            key: 'load',
            text: 'Load Items',
            iconProps: { iconName: 'Refresh' },
            onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => onCommandInternal('refresh')
        },
        {
            key: 'new',
            text: 'New item',
            iconProps: { iconName: 'NewFolder' },
            onClick: () => onCommandInternal('new')
        },
    ];

    return (
        <CommandBar
            items={barItems}
            ariaLabel="Items actions"
            primaryGroupAriaLabel="Items actions"
        />
    );
};

export default TaskCommandBar;
