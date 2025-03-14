import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { CommandBar, ICommandBarItemProps, IconButton, IIconProps, MessageBar, MessageBarType, Stack, TextField } from '@fluentui/react';
import { TaskItem } from '../../../dto/TaskItem';
import ShowDate from './ShowDate/ShowDate';
import ShowProject from './ShowProject/ShowProject';
import ShowFlag from './ShowFlag/ShowFlag';

const deleteIcon: IIconProps = { iconName: 'Delete' };
const editIcon: IIconProps = { iconName: 'Edit' };

const WebPartTemplate: React.FunctionComponent<IWebPartTemplateProps> = (props) => {

  const {
    dataService: spService,
    description,
    isDarkTheme,
    environmentMessage,
    hasTeamsContext,
    userDisplayName
  } = props;

  // gestione dello stato
  const [textFilter, setTextFilter] = useState<string>('');
  const [items, setItems] = useState<TaskItem[]>([]);


  const loadItems = (): void => {
    // debounce: https://www.freecodecamp.org/news/deboucing-in-react-autocomplete-example/
    spService.tasks.gets(textFilter)
      .then(items => setItems([...items]))
      .catch(e => console.error("loadItems", e));
  };

  const onLoadItems = async (): Promise<void> => {
    return loadItems();
  };

  const onCreate = async (): Promise<void> => {
    try {
      const str = (new Date()).toDateString();
      const item: TaskItem = {
        id: 0,
        title: "TEST New - " + str,
        isCompleted: false,
        projectName: "Project " + str
      };

      const newitem = await spService.tasks.add(item);
      console.log(`Item adddes id: ${newitem.id}`);
      loadItems();
    } catch (error) {
      console.error("_onCreate", error);
    }
  };

  const getSelection = (items: TaskItem[]): void => {
    console.log('Selected items:', items);
  };

  const onDelete = async (id: number): Promise<void> => {
    console.log(`Selected item id ${id} for delete`);
    try {
      await spService.tasks.delete(id);
      loadItems();
    } catch (e) {
      console.error("_onDelete", e);
    }
  };

  const onEdit = async (item: TaskItem): Promise<void> => {
    console.log('Selected item for edit:', item);

    item.projectName = item.projectName + " " + (new Date).toDateString();

    try {
      await spService.tasks.update(item);
      loadItems();
    } catch (e) {
      console.error("_onEdit", e);
    }
  };

  const onIsCompleted = async(item: TaskItem, newValue: boolean) : Promise<void> => {
    const updateItem = {...item};
    updateItem.isCompleted = newValue;
    await spService.tasks.update(updateItem);
    loadItems();
  }

  const barItems: ICommandBarItemProps[] = [
    {
      key: 'load',
      text: 'Load Items',
      iconProps: { iconName: 'Refresh' },
      onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void onLoadItems()
    },
    {
      key: 'new',
      text: 'New item',
      iconProps: { iconName: 'NewFolder' },
      onClick: () => void onCreate()
    },
  ];

  const viewFields: IViewField[] = [
    {
      name: "title",
      displayName: "Title",
      maxWidth: 100
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
      render: (rowItem: TaskItem) => <ShowFlag value={rowItem.isCompleted} onChangeValue={async (value) => await onIsCompleted(rowItem, value) } />
    },
    {
      name: "projectName",
      displayName: "Project name",
      maxWidth: 150,
      render: (rowItem: TaskItem) => <ShowProject id={rowItem.id} text={rowItem.projectName} />
    },
    {
      name: "modifiedStr",
      displayName: "Modified",
      maxWidth: 100,
      render: (rowItem: TaskItem) => <ShowDate date={rowItem.modifiedStr} />
    },
    {
      name: "",
      sorting: false,
      maxWidth: 40,
      render: (rowItem: TaskItem) => {
        const buttons = <div>
          <IconButton iconProps={deleteIcon} onClick={async () => { await onDelete(rowItem.id) }} title="Delete" ariaLabel="delete" />
          <IconButton iconProps={editIcon} onClick={async () => { await onEdit(rowItem) }} title="Edit" ariaLabel="edit" />
        </div>;
        return buttons;
      }
    }
  ];

  //componentDidMount
  useEffect(() => {
    console.log("componentDidMount called.");
    //void loadItems();
  }, []);

  //componentDidUpdate
  useEffect(() => {
    console.log("componentDidUpdate called.");
    loadItems();
  }, [textFilter]);

  //componentWillUnmount
  useEffect(() => {
    return () => {
      console.log("componentWillUnmount called.");
    };
  }, [items]);

  return (
    <section className={`${styles.webPartTemplate} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
        <h2>Well done, {escape(userDisplayName)}!</h2>
        <div>{environmentMessage}</div>
        <div>Web part property value: <strong>{escape(description)}</strong></div>
      </div>
      <div>
        <div>
          <CommandBar
            items={barItems}
            ariaLabel="Items actions"
            primaryGroupAriaLabel="Items actions"
          />
        </div>
        <div>
          <Stack>
            <TextField label="Search" value={textFilter} onChange={(_, newValue?: string) => setTextFilter(newValue ?? '')} />
          </Stack>
          <p>*{textFilter}*</p>
        </div>
        {items.length === 0 &&
          <MessageBar delayedRender={false} messageBarType={MessageBarType.error}>
            No items found.
          </MessageBar>
        }
        <div>
          <ListView
            items={items}
            viewFields={viewFields}
            iconFieldName="FileRef"
            compact={true}
            selectionMode={SelectionMode.single}
            selection={getSelection}
            stickyHeader={true}
          />
        </div>
      </div>
    </section>
  );

}

export default WebPartTemplate;