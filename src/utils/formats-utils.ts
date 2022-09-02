/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export function formatDate(startDate: any) {
  const initialDate = dayjs(startDate).format('dddd, DD/MM');
  const date = initialDate[0].toUpperCase() + initialDate.substring(1);
  const splitDate = date.split(',');
  return `${splitDate[0].split('-')[0]},${splitDate[1]}`;
}
