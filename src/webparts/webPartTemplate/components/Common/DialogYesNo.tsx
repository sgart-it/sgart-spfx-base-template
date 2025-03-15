import * as React from 'react';
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';
import { SOLUTION_NAME } from '../../../../constants';

const LOG_SOURCE: string = SOLUTION_NAME + ':DialogYesNo:';

export type DialogYesNoProps = {
    message: string;
    title?: string;
    data?: unknown,
    textConfirm?: string;
    textCancel?: string;
    onResponde: (confirmed: boolean, data?: unknown) => void;
};

const DialogYesNo: React.FC<DialogYesNoProps> = ({ message, title, data, textConfirm, textCancel, onResponde }) => {
    console.debug(`${LOG_SOURCE} ${message}`);

    const dialogContentProps = {
        type: DialogType.normal,
        title: title ?? 'Confirm',
        subText: message,
    };

    return (
        <Dialog hidden={false} dialogContentProps={dialogContentProps}>
            <DialogFooter>
                <PrimaryButton onClick={() => onResponde(true, data)} text={textConfirm ?? 'Yes'} />
                <DefaultButton onClick={() => onResponde(false, null)} text={textCancel ?? 'No'} />
            </DialogFooter>
        </Dialog>
    );
};

export default DialogYesNo;