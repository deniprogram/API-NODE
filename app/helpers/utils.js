const PRO_MONTHLY = 1;
const PRO_YEARLY = 2;

class Utils {

  generateRandomNumber() {
    return (Math.round((Math.random() * (9999999 - 999999)))).toString().slice(0,4);
  }

  calPercentage(porcentage, value) {
      return value * porcentage / 100;
  }

  transformInDecimal(value, number = 0) {
      return (value / 100).toFixed(number);
  }

  isProMonthly(idPlan) {
    return idPlan == PRO_MONTHLY;
  }

  isProYearly(idPlan) {
    return idPlan == PRO_YEARLY;
  }
}

module.exports = Utils;
