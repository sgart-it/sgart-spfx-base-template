import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './WebPartTemplate.module.scss';
import type { IWebPartTemplateProps } from './IWebPartTemplateProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Stack, TextField } from '@fluentui/react';
import { TaskItem } from '../../../dto/TaskItem';
import { SOLUTION_NAME } from '../../../constants';
import TaskListView, { TaskListViewEvents } from './TaskListView/TaskListView';
import TaskCommandBar, { TaskCommandBarEvents } from './TaskCommandBar/TaskCommandBar';
import { stringIsNullOrEmpty } from "@pnp/core";
import DialogYesNo from './Common/DialogYesNo';

const LOG_SOURCE: string = SOLUTION_NAME + ':WebPartTemplate:';

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
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | undefined>(undefined);


  const loadItems = async (): Promise<void> => {
    // debounce: https://www.freecodecamp.org/news/deboucing-in-react-autocomplete-example/
    try {
      const items = await spService.tasks.gets(textFilter);
      setItems([...items])
    } catch (e) {
      console.error(`${LOG_SOURCE} loadItems`, e);
    }
  };

  const createTaskItem = async (): Promise<void> => {
    const str = (new Date()).toDateString();
    const item: TaskItem = {
      id: 0,
      title: "TEST New - " + str,
      isCompleted: false,
      projectName: "Project " + str
    };

    const newitem = await spService.tasks.add(item);
    console.debug(`${LOG_SOURCE} Item addded id: ${newitem.id}`);
  };

  const onCommandTaskBar = async (event: TaskCommandBarEvents): Promise<void> => {
    console.debug(`${LOG_SOURCE} onCommandTaskBar`, event);
    try {
      switch (event) {
        case 'new':
          await createTaskItem();
          break;
        case 'refresh':
          break;
        default:
          console.warn(`${LOG_SOURCE} onCommandTaskList`, `Event ${event} not supported.`);
          return;
      }
      await loadItems();
    } catch (error) {
      console.error(`${LOG_SOURCE} onCommandTaskBar`, error);
    }

  }

  // Event handler TaskListView
  const onUpdatingTaskList = async (event: TaskListViewEvents, item: TaskItem): Promise<void> => {
    console.debug(`${LOG_SOURCE} onUpdatingTaskList`, event, item);
    try {
      switch (event) {
        case 'edit':
          item.projectName = item.projectName + " " + (new Date).toDateString();
          await spService.tasks.update(item);
          await loadItems();
          break;
        case 'update':
          await spService.tasks.update(item);
          await loadItems();
          break;
        case 'delete':
          setTaskToDelete(item);
          //await spService.tasks.delete(item.id);
          break;
        default:
          console.warn(`${LOG_SOURCE} onUpdatingTaskList`, `Event ${event} not supported.`);
          return;
      }
    } catch (e) {
      console.error(`${LOG_SOURCE} onUpdatingTaskList`, e);
    }
  }

  const onRespondeDeleteDialog = async (confirmed: boolean, data?: unknown): Promise<void> => {
    console.debug(`${LOG_SOURCE} onRespondeDialog`, confirmed);
    if (confirmed) {
      console.warn(`${LOG_SOURCE} onRespondeDialog`, `Delete item`, data);
      await spService.tasks.delete((data as TaskItem).id);
      await loadItems();
    }
    setTaskToDelete(undefined);
  }

  //componentDidMount
  useEffect(() => {
    console.debug(`${LOG_SOURCE} componentDidMount called.`);
    //void loadItems();
  }, []);

  //componentDidUpdate
  useEffect(() => {
    console.debug(`${LOG_SOURCE} componentDidUpdate called.`);
    void loadItems()
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
        <TaskCommandBar onCommand={onCommandTaskBar} />
        <Stack>
          <TextField label="Search" value={textFilter} onChange={(_, newValue?: string) => setTextFilter(newValue ?? '')} />
          <p>Filter text: {stringIsNullOrEmpty(textFilter) ? '-' : textFilter}</p>
        </Stack>
        <TaskListView items={items} onUpdating={onUpdatingTaskList} />
      </div>

      {taskToDelete && <DialogYesNo message={`Delete item id ${taskToDelete.id} with title '${taskToDelete.title}'`} onResponde={onRespondeDeleteDialog} data={taskToDelete}/>}
    </section>
  );

}

export default WebPartTemplate;