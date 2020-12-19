var DateUtils = Class.create();
DateUtils.prototype = {
	
    initialize: function() {
    },

    type: 'DateUtils'
};

DateUtils.day_in_ms = 86400000;

/*
 * getDayOfYear
 * Returns the day of the year for the current year
 */
DateUtils.getDayOfYear = function() {
	
	var gdt_start = new GlideDateTime();
	var gdt_today = new GlideDateTime();

	gdt_start.setMonthUTC(12);
	gdt_start.setDayOfMonthUTC(31);
	gdt_start.setYearUTC(gdt_start.getYearUTC() - 1);

	var dur = GlideDateTime.subtract(gdt_start, gdt_today);
	return dur.getNumericValue() / this.day_in_ms;

};

/*
 * getDaysInYear
 * Gets the number of days in the year for the given year
 * If year is not provided, then current year
 */
DateUtils.getDaysInYear = function(year) {
    var gdt_start = new GlideDateTime();
    var gdt_end = new GlideDateTime();
    year = year | gdt_start.getYearUTC();

	// set start date to 1st January for the specified year
    gdt_start.setMonthUTC(1);
    gdt_start.setDayOfMonthUTC(1);
    gdt_start.setYearUTC(year);

	// set the end date to 1st January the following year
    gdt_end.setYearUTC(year + 1);
    gdt_end.setMonthUTC(1);
    gdt_end.setDayOfMonthUTC(1);

    var dur = GlideDateTime.subtract(gdt_start, gdt_end);
    return dur.getNumericValue() / this.day_in_ms;
};

/*
 * getPercentageComplete
 * returns the percentage for how complete the year is
 */
DateUtils.getPercentageComplete = function() {
    var days_in_year = this.getDaysInYear();
    var current_day = this.getDayOfYear();
    var percentage_complete = (100 / days_in_year) * current_day;
    return Math.floor(percentage_complete);
};
