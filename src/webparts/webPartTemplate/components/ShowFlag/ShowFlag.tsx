import { Toggle } from '@fluentui/react';
import * as React from 'react';
/*
const iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 25px',
});*/

const ShowFlag: React.FC<{ value: boolean, onChangeValue?: (value: boolean) => void }> = (props) => {
    const { value, onChangeValue } = props;

    const onChangeLocal = (event: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
        if (onChangeValue)
            onChangeValue(checked ?? false);
    };

    return (
        // https://developer.microsoft.com/en-us/fluentui#/controls/web/toggle
        <Toggle defaultChecked checked={value} onChange={onChangeLocal} />

        /*<FontIcon aria-label="Compass" iconName="CompassNW" className={iconClass} />*/
    )
};

export default ShowFlag;