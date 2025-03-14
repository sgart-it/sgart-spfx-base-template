import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { CommandBar, ICommandBarItemProps, MessageBar, MessageBarType, Stack, TextField } from '@fluentui/react';
import { TaskItem } from '../../../dto/TaskItem';
import { LOG_SOURCE_BASE } from '../../../constants';
import TaskListView, { TaskListViewEvents } from './TaskListView/TaskListView';

const LOG_SOURCE: string = LOG_SOURCE_BASE + ':WebPartTemplate:';

const WebPartTemplate: React.FunctionComponent<IWebPartTemplateProps> = (props) => {

  const {
    dataService: spService,
    description,
    //isDarkTheme,
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
      .catch(e => console.error(`${LOG_SOURCE} loadItems`, e));
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
      console.debug(`${LOG_SOURCE} Item addded id: ${newitem.id}`);
      loadItems();
    } catch (error) {
      console.error(`${LOG_SOURCE} onCreate`, error);
    }
  };

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

  // Event handler TaskListView
  const onUpdatingTaskList = async (event: TaskListViewEvents, item: TaskItem): Promise<void> => {
    console.debug(`${LOG_SOURCE} onUpdatingTaskList`, event, item);
    try {
      switch (event) {
        case 'delete':
          await spService.tasks.delete(item.id);
          break;
        case 'edit':
          item.projectName = item.projectName + " " + (new Date).toDateString();
          await spService.tasks.update(item);
          break;
        case 'update':
          await spService.tasks.update(item);
          break;
        default:
          console.warn(`${LOG_SOURCE} onUpdatingTaskList`, `Event ${event} not supported.`);
          return;
      }
      loadItems();
    } catch (e) {
      console.error(`${LOG_SOURCE} onUpdatingTaskList`, e);
    }
  }

  //componentDidMount
  useEffect(() => {
    console.debug(`${LOG_SOURCE} componentDidMount called.`);
    //void loadItems();
  }, []);

  //componentDidUpdate
  useEffect(() => {
    console.debug(`${LOG_SOURCE} componentDidUpdate called.`);
    loadItems();
  }, [textFilter]);

  //componentWillUnmount
  useEffect(() => {
    return () => {
      console.debug(`${LOG_SOURCE} componentWillUnmount called.`);
    };
  }, []);

  return (
    <section className={`${styles.webPartTemplate} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        {/* <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} /> */}
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
          <p>Filter text: [{textFilter}]</p>
        </div>
        {items.length === 0 &&
          <MessageBar delayedRender={false} messageBarType={MessageBarType.error}>
            No items found.
          </MessageBar>
        }
        <div>
          <TaskListView items={items} onUpdating={onUpdatingTaskList} />
        </div>
      </div>
    </section>
  );

}

export default WebPartTemplate;