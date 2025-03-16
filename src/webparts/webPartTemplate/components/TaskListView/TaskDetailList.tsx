import * as React from 'react';
import { TaskItem } from '../../../../dto/TaskItem';
import { DetailsList, DetailsListLayoutMode, IColumn, IconButton, IIconProps, MessageBar, MessageBarType, SelectionMode } from '@fluentui/react';
import ShowFlag from '../Common/ShowFlag';
import ShowProject from '../ShowProject/ShowProject';
import ShowDate from '../Common/ShowDate';
import { SOLUTION_NAME } from '../../../../constants';

const LOG_SOURCE: string = SOLUTION_NAME + ':TaskListView:';

const editIcon: IIconProps = { iconName: 'Edit' };
const deleteIcon: IIconProps = { iconName: 'Delete', style: { verticalAlign: 'middle' } };

export type TaskDetailListEvents = | "delete" | "edit" | "update";

export type TaskDetailListProps = {
    items: TaskItem[];
    onUpdating(event: TaskDetailListEvents, item: TaskItem): void;
}

const TaskDetailList: React.FC<TaskDetailListProps> = ({ items, onUpdating }) => {
    console.debug(`${LOG_SOURCE} TaskListView2`);

    const onCompleteChanged = async (item: TaskItem, newValue: boolean): Promise<void> => {
        const updateItem = { ...item };
        updateItem.isCompleted = newValue;
        await onUpdating('update', updateItem);
    }

    const columns: IColumn[] = [
        {
            key: 'title',
            fieldName: "title",
            name: "Title",
            minWidth: 0,
            maxWidth: 100,
            onRender: (item: TaskItem) => <span title={item.title}>{item.title}</span>,
        },
        {
            key: 'id',
            fieldName: "id",
            name: "Id",
            minWidth: 0,
            maxWidth: 50
        },
        {
            key: 'isCompleted',
            fieldName: "isCompleted",
            name: "Completed",
            minWidth: 0,
            maxWidth: 50,
            onRender: (item: TaskItem) => <ShowFlag value={item.isCompleted} onChangeValue={(value) => onCompleteChanged(item, value)} />
        },
        {
            key: 'projectName',
            fieldName: "projectName",
            name: "Project name",
            minWidth: 0,
            maxWidth: 100,
            onRender: (item: TaskItem) => <ShowProject id={item.id} text={item.projectName} />
        },
        {
            key: 'modified',
            fieldName: "modified",
            name: "Modified",
            minWidth: 0,
            maxWidth: 100,
            onRender: (item: TaskItem) => <ShowDate date={item.modified} />
        },
        {
            key: 'actions',
            name: "",
            minWidth: 0,
            maxWidth: 30,
            onRender: (item: TaskItem) => <>
                <IconButton iconProps={editIcon} onClick={() => onUpdating('edit', item)} title="Edit" ariaLabel="edit" />
                <IconButton iconProps={deleteIcon} onClick={() => onUpdating('delete', item)} title="Delete" ariaLabel="delete" />
            </>
        }
    ];

    const getKey = (item: TaskItem): string => item.id.toString();

    return (
        <>
            {items.length === 0 &&
                <MessageBar delayedRender={false} messageBarType={MessageBarType.error}>
                    No items found.
                </MessageBar>
            }
            <DetailsList
                items={items}
                compact={true}
                columns={columns}
                selectionMode={SelectionMode.none}
                getKey={getKey}
                setKey="none"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
            //onItemInvoked={this._onItemInvoked}
            />
        </>
    );
};

export default TaskDetailList;
