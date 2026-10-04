import dayjs from 'dayjs';

import type { PluginFunc } from 'dayjs';

export const totalPlugin: PluginFunc = (_option, dayjsClass) => {
  const oldStartOf = dayjsClass.prototype.startOf;
  dayjsClass.prototype.startOf = function (unit: unknown) {
    if (unit === 'total') return dayjs('2021');
    return oldStartOf.call(this, unit as never);
  };

  const oldAdd = dayjsClass.prototype.add;
  dayjsClass.prototype.add = function (number: number, unit: unknown) {
    if (unit === 'total') {
      if (number > 0) return dayjs().add(1, 'day');
      return dayjs('2021').subtract(1, 'day');
    }
    return oldAdd.call(this, number, unit as never);
  };
};
