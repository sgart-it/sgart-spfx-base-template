import * as React from 'react';
import { TaskItem } from '../../../../dto/TaskItem';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IconButton, IIconProps, MessageBar, MessageBarType } from '@fluentui/react';
import ShowFlag from '../Common/ShowFlag';
import ShowProject from '../ShowProject/ShowProject';
import ShowDate from '../Common/ShowDate';
import { SOLUTION_NAME } from '../../../../constants';

const LOG_SOURCE: string = SOLUTION_NAME + ':TaskListView:';

const deleteIcon: IIconProps = { iconName: 'Delete' };
const editIcon: IIconProps = { iconName: 'Edit' };

export type TaskListViewEvents = | "delete" | "edit" | "update";

export type TaskListViewProps = {
    items: TaskItem[];
    onUpdating(event: TaskListViewEvents, item: TaskItem): void;
}

const TaskListView: React.FC<TaskListViewProps> = (props) => {
    const { items } = props;

    const getSelection = (items: TaskItem[]): void => {
        console.debug(`${LOG_SOURCE}`, items);
    };

    const onCompleteChanged = async (item: TaskItem, newValue: boolean): Promise<void> => {
        const updateItem = { ...item };
        updateItem.isCompleted = newValue;
        await props.onUpdating('update', updateItem);
    }

    const viewFields: IViewField[] = [
        {
            name: "title",
            displayName: "Title",
            maxWidth: 100,
            render: (item: TaskItem) => <span title={item.title}>{item.title}</span>
        },
        {
            name: "id",
            displayName: "Id",
            maxWidth: 50
        },
        {
            name: "isCompleted",
            displayName: "Completed",
            maxWidth: 50,
            render: (item: TaskItem) => <ShowFlag value={item.isCompleted} onChangeValue={(value) => onCompleteChanged(item, value)} />
        },
        {
            name: "projectName",
            displayName: "Project name",
            maxWidth: 100,
            render: (item: TaskItem) => <ShowProject id={item.id} text={item.projectName} />
        },
        {
            name: "modifiedStr",
            displayName: "Modified",
            maxWidth: 100,
            render: (item: TaskItem) => <ShowDate date={item.modifiedStr} />
        },
        {
            name: "",
            sorting: false,
            maxWidth: 40,
            render: (item: TaskItem) => {
                const buttons = <div>
                    <IconButton iconProps={deleteIcon} onClick={() => props.onUpdating('delete', item)} title="Delete" ariaLabel="delete" />
                    <IconButton iconProps={editIcon} onClick={() => props.onUpdating('edit', item)} title="Edit" ariaLabel="edit" />
                </div>;
                return buttons;
            }
        }
    ];

    return (
        <>
            {items.length === 0 &&
                <MessageBar delayedRender={false} messageBarType={MessageBarType.error}>
                    No items found.
                </MessageBar>
            }
            <ListView
                items={items}
                viewFields={viewFields}
                iconFieldName="FileRef"
                compact={true}
                selectionMode={SelectionMode.none}
                selection={getSelection}
                stickyHeader={true}
            />
        </>
    );
};

export default TaskListView;
