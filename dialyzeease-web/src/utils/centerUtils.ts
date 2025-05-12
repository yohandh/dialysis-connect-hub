
import { DialysisCenter } from "@/data/centerData";

// Format operating hours for display
export const formatOperatingHours = (center: DialysisCenter) => {
  // Check if all weekdays have the same hours
  const weekdayHours = center.centerHours.monday;
  const allWeekdaysSame = [
    center.centerHours.tuesday,
    center.centerHours.wednesday,
    center.centerHours.thursday,
    center.centerHours.friday
  ].every(hours => hours === weekdayHours);

  // Check if weekend days have the same hours
  const weekendSame = center.centerHours.saturday === center.centerHours.sunday;

  if (allWeekdaysSame && weekendSame && center.centerHours.saturday === weekdayHours) {
    return `All days: ${weekdayHours}`;
  } else if (allWeekdaysSame) {
    const result = [`Mon-Fri: ${weekdayHours}`];
    if (center.centerHours.saturday !== 'Closed') {
      result.push(`Sat: ${center.centerHours.saturday}`);
    }
    if (center.centerHours.sunday !== 'Closed') {
      result.push(`Sun: ${center.centerHours.sunday}`);
    }
    return result.join('; ');
  } else {
    // Just show M-F and weekend as groups
    return "Various hours; see details";
  }
};
