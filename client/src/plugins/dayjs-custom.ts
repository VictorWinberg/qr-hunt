import dayjs from "dayjs";

export const total = (_option, dayjsClass) => {
  const oldStartOf = dayjsClass.prototype.startOf;
  dayjsClass.prototype.startOf = function(unit: string, _startOf) {
    if (unit !== "total") return oldStartOf.bind(this)(unit, _startOf);

    return dayjs("2021");
  };

  const oldAdd = dayjsClass.prototype.add;
  dayjsClass.prototype.add = function(number: number, unit: string) {
    if (unit !== "total") return oldAdd.bind(this)(number, unit);

    if (number > 0) {
      return dayjs().add(1, "day");
    } else {
      return dayjs("2021").subtract(1, "day");
    }
  };
};
