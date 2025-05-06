import moment from "moment-timezone";
import 'moment/locale/th';

moment.locale('th');

export const useDateConverter = (dateString: string, lang?: 'th-TH' | 'en-EN', short?: boolean): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = short ?
    {
      timeZone: 'Asia/Bangkok',
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    } :
    {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

  if (!lang) lang = 'en-EN';

  return date.toLocaleString(lang, options) + ' น.';
};

export const convertDateToISO = (date: string) => {
  return moment(date).format('YYYY-MM-DD');
}

export const convertDateToShort = (date: string) => {
  return moment(date).format('DD/MM/YYYY HH:mm');
}

export const convertDateToShortWithSecond = (date: string) => {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
}

export const getRandomNameFromDate = (): string => {
  return String(Date.now() + Math.round(Math.random() * 1000))
}

export const convertDateFromNow = (date: string) => {
  return moment(date).fromNow();
}