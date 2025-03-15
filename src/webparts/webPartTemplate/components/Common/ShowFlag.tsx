import { Toggle } from '@fluentui/react';
import * as React from "react";
/*
const iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 25px',
});*/

/*
interface IShowFlagProps {
    value: boolean;
    onChangeValue?: (value: boolean) => void;
}
    */

// const ShowFlag: React.FC<IShowFlagProps> = (props) => {
// const ShowFlag: React.FC<IShowFlagProps> = ({ value, onChangeValue }) => {
const ShowFlag: React.FC<{ value: boolean, onChangeValue?: (value: boolean) => void }> = ({ value, onChangeValue }) => {

    const onChangeLocal = (_: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
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