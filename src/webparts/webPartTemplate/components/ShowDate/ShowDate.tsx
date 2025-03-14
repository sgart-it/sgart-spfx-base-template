import * as React from 'react';
import { formatDate } from '../../../../helpers/DateHelper';

export type ShowDateProp = {
    date?: Date | string;
    locale?: string;
    dateOnly?: boolean;
};

const ShowDate: React.FunctionComponent<ShowDateProp> = (props: ShowDateProp): JSX.Element => {
    const { date, locale, dateOnly } = props;

    const str = formatDate(date, locale, dateOnly);

    return <span style={{ border: "1px solid red" }} title={str}>{str}</span>;
};

export default ShowDate;