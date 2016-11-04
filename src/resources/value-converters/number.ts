export class DecimalNumberValueConverter {
 toView(value, format) {
    if (!value && value !== 0)
      return null;
    return Number(value).toFixed(format);
  }

}

