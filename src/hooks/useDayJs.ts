import AdvancedFormat from 'dayjs/plugin/advancedFormat';
import DAYJS from 'dayjs';
import 'dayjs/locale/tr';

DAYJS.extend(AdvancedFormat);

type date = string | number | Date;

type dayjsProps = {
  date: date;
  locale?: string;
  format?: string;
};

const useDayJs = () => {
  const dayjs = ({ date, format, locale }: dayjsProps) => {
    return DAYJS(date)
      .locale(locale ?? 'tr')
      .format(format);
  };

  return { dayjs };
};

export { useDayJs };
